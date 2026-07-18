import { defineMcp } from "@lovable.dev/mcp-js";
import getOffer from "./tools/get-offer";
import getCheckoutLink from "./tools/get-checkout-link";

export default defineMcp({
  name: "futbol-ejercicios-mcp",
  title: "+2.000 Ejercicios de Fútbol",
  version: "0.1.0",
  instructions:
    "Public MCP for the +2.000 Ejercicios de Fútbol landing page. Use `get_offer` to fetch the current product offer, pricing, bonuses and value props. Use `get_checkout_link` for the direct purchase URL.",
  tools: [getOffer, getCheckoutLink],
});