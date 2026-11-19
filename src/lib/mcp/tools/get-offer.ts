import { defineTool } from "@lovable.dev/mcp-js";
import { plans } from "@/lib/offer";
export default defineTool({
  name: "get_offer",
  title: "Get current offer",
  description: "Current Fútbol con Plan plans, inclusions and checkout availability.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const offer = {
      product: "Fútbol con Plan",
      currency: "USD",
      plans: [
        {
          ...plans.completo,
          checkoutUrl: plans.completo.checkoutUrl || null,
          includes: [
            "Biblioteca de más de 2.000 ejercicios",
            "Guía de Entrenamiento",
            "50 Ejercicios de Técnica Individual",
            "Circuitos de Preparación Física",
            "Bono Sorpresa",
          ],
        },
        {
          ...plans.basico,
          checkoutUrl: plans.basico.checkoutUrl || null,
          includes: ["Solo la biblioteca de más de 2.000 ejercicios por posición y categoría"],
        },
      ],
      guarantee_days: 7,
      nutrition_module: "En preparación. No incluido. Sin fecha garantizada.",
      planning_example: "Ejemplo orientativo de cuatro semanas; no es un plan personalizado.",
    };
    return {
      content: [{ type: "text" as const, text: JSON.stringify(offer, null, 2) }],
      structuredContent: offer,
    };
  },
});
