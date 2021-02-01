const moneyFormatter = new Intl.NumberFormat("nl-NL", {
  style: "currency",
  currency: "EUR",
});

export function formatMoney(amount: number | undefined) {
  return moneyFormatter.format(amount || 0);
}
