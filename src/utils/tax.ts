export function calculateTOT(grossTurnover: number, rate: number): number {
  return Math.round((grossTurnover * (rate / 100)) * 100) / 100;
}
