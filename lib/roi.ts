export const HOURLY_RATE_DKK = 350;
export const WEEKS_PER_MONTH = 4.33;

export function calculateMonthlyCost(hoursPerWeek: number): number {
  return Math.round(hoursPerWeek * HOURLY_RATE_DKK * WEEKS_PER_MONTH);
}

export function formatDKK(amount: number): string {
  return new Intl.NumberFormat("da-DK").format(amount);
}
