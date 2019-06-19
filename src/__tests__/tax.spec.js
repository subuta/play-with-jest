import applyTax from '../tax'

test('should calculate japanese tax.', () => {
  expect(applyTax(100, 1.08)).toBe('¥108')
  expect(applyTax(101, 1.08, false)).toBe('¥109')

  // Min price
  expect(applyTax(0, 1.08)).toBe('¥0')

  // Max price
  expect(applyTax(Number.MAX_SAFE_INTEGER / 1.08, 1.08)).toBe('¥9007199254740990')
})
