const moneyFormatter = new Intl.NumberFormat("nl-NL", {
  style: "currency",
  currency: "EUR",
});

export function formatMoney(amount: number) {
  return moneyFormatter.format(amount);
}
