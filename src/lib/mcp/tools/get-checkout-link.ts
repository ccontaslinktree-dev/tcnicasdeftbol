import { defineTool } from "@lovable.dev/mcp-js";
import { plans } from "@/lib/offer";
export default defineTool({
  name: "get_checkout_link",
  title: "Get checkout links",
  description: "Checkout availability for the two current Fútbol con Plan offers.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [
      {
        type: "text" as const,
        text: JSON.stringify({
          completo: plans.completo.checkoutUrl || null,
          basico: plans.basico.checkoutUrl || null,
          status: plans.completo.checkoutUrl && plans.basico.checkoutUrl ? "available" : "pending",
        }),
      },
    ],
    structuredContent: {
      completo: plans.completo.checkoutUrl || null,
      basico: plans.basico.checkoutUrl || null,
    },
  }),
});
