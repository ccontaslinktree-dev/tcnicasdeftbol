import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "get_offer",
  title: "Get current offer",
  description: "Returns the current landing page offer: product name, pricing, discount, checkout URL, and value propositions.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const offer = {
      product: "+2.000 Ejercicios de Fútbol — Biblioteca Completa",
      description:
        "Biblioteca con más de 2.000 entrenamientos de fútbol organizados por posición y categoría: físico, táctico, dribles, agilidad, chutes, pases y más. Acceso inmediato, listo para aplicar.",
      price_usd: 5,
      original_price_usd: 29.9,
      discount_percent: 83,
      urgency: "Solo Hoy",
      checkout_url: "https://pay.hotmart.com/",
      guarantee_days: 7,
      delivery: "Acceso inmediato a la biblioteca online",
      categories: [
        "Entrenamientos físicos",
        "Tácticos",
        "Dribles",
        "Agilidad",
        "Estrategias",
        "Pases",
        "Chutes",
      ],
      bonuses: [
        "Bonus Sorpresa",
        "Estadísticas y control de rendimiento",
        "Guías de entrenamiento",
        "Control de balón",
      ],
    };
    return {
      content: [{ type: "text", text: JSON.stringify(offer, null, 2) }],
      structuredContent: offer,
    };
  },
});