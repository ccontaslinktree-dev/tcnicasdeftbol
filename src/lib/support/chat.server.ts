import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { ARTICLES } from "./knowledge";
import { getOrCreateSession, isRateLimited } from "./support.server";
import {
  createLovableAiGatewayRunIdFetch,
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
} from "./run-id.server";

const MODEL = "openai/gpt-6-astra";

const SYSTEM = `Eres "Capitán", el asistente de soporte de "2000 Ejercicios de Fútbol", una biblioteca digital de más de 2.000 ejercicios de fútbol vendida y entregada por Hotmart.
Responde SIEMPRE en español neutro de Latinoamérica, con tono cercano, claro y breve (máximo ~120 palabras), usando pasos numerados cuando ayuden.

Reglas estrictas:
- No tienes acceso a cuentas, pagos, pedidos ni a Hotmart. Nunca afirmes ni inventes el estado de una compra, pago, reembolso o acceso. Si el cliente pregunta por su caso concreto, dilo claramente y sugiere revisar su correo/cuenta de Hotmart o abrir un ticket con el equipo.
- No inventes precios, plazos, horarios de atención ni tiempos de respuesta del equipo.
- Usa solo la información de la base de conocimiento. Si no sabes algo, dilo y ofrece crear un ticket.
- Haz una pregunta de seguimiento útil cuando falte información (ej.: método de pago, dispositivo, email usado al comprar ¿lo revisaste?).
- Nunca pidas datos de tarjeta ni contraseñas.
- Si el cliente quiere hablar con una persona, indica que use el botón "Hablar con el equipo" de esta página.

Base de conocimiento:
${ARTICLES.map((a) => `## ${a.title}\n${a.body}`).join("\n\n")}`;

const body = z.object({
  token: z.string().uuid(),
  messages: z.array(z.any()).min(1).max(60),
});

export async function handleSupportChat(request: Request) {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "El asistente no está configurado todavía." }, { status: 503 });
  }
  const parsed = body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Solicitud inválida" }, { status: 400 });
  const messages = parsed.data.messages as UIMessage[];
  const last = messages[messages.length - 1];
  if (last?.role !== "user") return Response.json({ error: "Solicitud inválida" }, { status: 400 });
  const lastText = last.parts
    ?.map((p) => (p.type === "text" ? p.text : ""))
    .join("")
    .trim();
  if (!lastText || lastText.length > 1500) {
    return Response.json({ error: "El mensaje debe tener entre 1 y 1500 caracteres." }, { status: 400 });
  }

  const sessionId = await getOrCreateSession(parsed.data.token);
  if (await isRateLimited(sessionId)) {
    return Response.json(
      { error: "Estás enviando muchos mensajes. Espera un minuto e inténtalo de nuevo." },
      { status: 429 },
    );
  }
  const { error: saveErr } = await supabaseAdmin
    .from("support_chat_messages")
    .insert({ session_id: sessionId, role: "user", message: last as never });
  if (saveErr) console.error("save user message", saveErr);

  // Only the latest 20 turns go to the model; keep only text parts.
  const history = messages.slice(-20).map((m) => ({
    ...m,
    parts: m.parts.filter((p) => p.type === "text"),
  }));

  const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });

  const result = streamText({
    model: provider.responses(MODEL),
    instructions: SYSTEM,
    messages: await convertToModelMessages(history),
    abortSignal: request.signal,
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  });

  return withLovableAiGatewayRunIdHeader(
    result.toUIMessageStreamResponse({
      originalMessages: messages,
      onFinish: async ({ responseMessage }) => {
        const clean = {
          ...responseMessage,
          parts: responseMessage.parts.filter((p) => p.type === "text"),
        };
        const { error } = await supabaseAdmin
          .from("support_chat_messages")
          .insert({ session_id: sessionId, role: "assistant", message: clean as never });
        if (error) console.error("save assistant message", error);
      },
      onError: (err) => {
        console.error("support chat error", err);
        const status = (err as { statusCode?: number })?.statusCode;
        if (status === 429) return "El asistente está muy solicitado. Inténtalo en un momento.";
        if (status === 402) return "El asistente no está disponible por ahora. Puedes hablar con el equipo.";
        return "No pude responder ahora. Inténtalo de nuevo o habla con el equipo.";
      },
    }),
    runIdFetch,
  );
}
