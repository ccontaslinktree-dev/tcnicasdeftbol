import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { TICKET_TOPICS } from "./knowledge";

const token = z.string().uuid();

export const loadChatHistory = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ token }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: s } = await supabaseAdmin
      .from("support_chat_sessions")
      .select("id")
      .eq("client_token", data.token)
      .maybeSingle();
    if (!s) return { messages: [] as unknown[] };
    const { data: rows, error } = await supabaseAdmin
      .from("support_chat_messages")
      .select("message")
      .eq("session_id", s.id)
      .order("created_at")
      .limit(100);
    if (error) throw new Error("No se pudo cargar la conversación");
    return { messages: (rows ?? []).map((r) => r.message) as unknown[] };
  });

export const clearChatHistory = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ token }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("support_chat_sessions").delete().eq("client_token", data.token);
    return { ok: true };
  });

const ticketInput = z.object({
  token,
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  topic: z.enum(TICKET_TOPICS),
  description: z.string().trim().min(10).max(2000),
});

function makeReference() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  for (const b of bytes) out += chars[b % chars.length];
  return `SOP-${out}`;
}

export const createTicket = createServerFn({ method: "POST" })
  .inputValidator((d) => ticketInput.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const since = new Date(Date.now() - 60 * 60_000).toISOString();
    const { count } = await supabaseAdmin
      .from("support_tickets")
      .select("id", { count: "exact", head: true })
      .eq("client_token", data.token)
      .gte("created_at", since);
    if ((count ?? 0) >= 5) {
      throw new Error("Has creado varios tickets en poco tiempo. Espera un momento antes de crear otro.");
    }
    const { data: row, error } = await supabaseAdmin
      .from("support_tickets")
      .insert({
        reference: makeReference(),
        client_token: data.token,
        name: data.name,
        email: data.email.toLowerCase(),
        topic: data.topic,
        description: data.description,
      })
      .select("reference, topic, status, created_at")
      .single();
    if (error) throw new Error("No se pudo crear el ticket. Inténtalo de nuevo.");
    return row;
  });

export const listMyTickets = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ token }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("support_tickets")
      .select("reference, topic, status, created_at")
      .eq("client_token", data.token)
      .order("created_at", { ascending: false })
      .limit(20);
    if (error) throw new Error("No se pudieron cargar tus tickets");
    return rows ?? [];
  });

export const lookupTicket = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        reference: z.string().trim().toUpperCase().regex(/^SOP-[A-Z0-9]{6}$/),
        email: z.string().trim().email().max(160),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("support_tickets")
      .select("reference, topic, status, created_at")
      .eq("reference", data.reference)
      .eq("email", data.email.toLowerCase())
      .maybeSingle();
    return row ?? null;
  });
