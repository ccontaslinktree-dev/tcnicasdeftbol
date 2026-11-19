export type PlanId = "completo" | "basico";
export const plans = {
  completo: { name: "Plan Completo", price: 10, checkoutUrl: "" },
  basico: { name: "Plan Básico", price: 6.5, checkoutUrl: "" },
} satisfies Record<PlanId, { name: string; price: number; checkoutUrl: string }>;
// Configure the new Hotmart URLs here once the two matching offers are created.
export const formatUSD = (value: number) =>
  "US$ " +
  new Intl.NumberFormat("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    .format(value)
    .replace(".", ",");
