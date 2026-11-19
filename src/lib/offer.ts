export type PlanId = "completo" | "basico";
export const plans = {
  completo: { name: "Plan Completo", price: 10, checkoutUrl: "https://pay.hotmart.com/X107868534F?checkoutMode=10" },
  basico: { name: "Plan Básico", price: 6.5, checkoutUrl: "https://pay.hotmart.com/G107438250J?checkoutMode=10" },
} satisfies Record<PlanId, { name: string; price: number; checkoutUrl: string }>;
// Hotmart destinations for the matching complete and basic offers.
export const formatUSD = (value: number) =>
  "US$ " +
  new Intl.NumberFormat("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    .format(value)
    .replace(".", ",");
