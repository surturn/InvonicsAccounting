import { calculateTOT } from '../utils/tax';

describe('TOT Calculation', () => {
  it('calculates TOT at 1.5% of gross turnover', () => {
    expect(calculateTOT(100000, 1.5)).toBe(1500);
    expect(calculateTOT(250000, 1.5)).toBe(3750);
    expect(calculateTOT(0, 1.5)).toBe(0);
  });

  it('rounds TOT correctly to 2 decimal places', () => {
    // 100001 * 0.015 = 1500.015 -> 1500.02
    expect(calculateTOT(100001, 1.5)).toBe(1500.02);
  });
});
