import sinon from 'sinon'

import applyTax from '../tax'

test('should calculate tax.', () => {
  expect(applyTax(100, 1.08)).toBe('¥108')
  expect(applyTax(101, 1.08, false)).toBe('¥109')

  // Defaults to Japanese tax when tax omitted.
  expect(applyTax(100)).toBe('¥108')

  // Min price
  expect(applyTax(0, 1.08)).toBe('¥0')

  // Max price
  // SEE: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER
  expect(applyTax(Number.MAX_SAFE_INTEGER / 1.08, 1.08)).toBe('¥9007199254740990')
})

test('should calculate japanese tax with date.', () => {
  let clock = sinon.useFakeTimers({
    // When 2019/9/30 23:59:59
    now: new Date(2019, 8, 30, 23, 59, 59).getTime(),
    toFake: ['Date']
  })

  // Sales tax before 2019/10/1 should be 8%.
  expect(applyTax(100)).toBe('¥108')

  clock.restore()
  clock = sinon.useFakeTimers({
    // When 2019/10/1
    now: new Date(2019, 9, 1).getTime(),
    toFake: ['Date']
  })

  // Sales tax after 2019/10/1 should be 10%.
  expect(applyTax(100)).toBe('¥110')

  // Restore clock.
  clock.restore()
})
