const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  // Whole-dollar prices read "$2,450"; others keep their cents ("$19.50").
  trailingZeroDisplay: "stripIfInteger",
});

export function formatPrice(cents: number) {
  if (!Number.isFinite(cents)) return "$0";
  return priceFormatter.format(cents / 100);
}
