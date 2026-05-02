const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  minimumIntegerDigits: 1,
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
  currency: 'USD',
});

export const BUNDLE_NAME = 'nodecg-trading-paces-layouts';

export function formatCurrency(value: number) {
  return CURRENCY_FORMATTER.format(value);
}