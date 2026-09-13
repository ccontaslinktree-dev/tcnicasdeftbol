import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "get_checkout_link",
  title: "Get checkout link",
  description: "Returns the direct checkout URL where users can purchase the +2.000 Ejercicios de Fútbol library.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [
      {
        type: "text",
        text: "Checkout: https://pay.hotmart.com/",
      },
    ],
    structuredContent: { checkout_url: "https://pay.hotmart.com/" },
  }),
});