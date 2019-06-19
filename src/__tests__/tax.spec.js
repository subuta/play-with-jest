import applyTax from '../tax'

test('should calculate japanese tax.', () => {
  expect(applyTax(100, 1.08)).toBe("¥108")
  expect(applyTax(101, 1.08, false)).toBe("¥109")
})
