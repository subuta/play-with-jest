import * as d3 from 'd3-format'

// Format as japanese currency.
const ja = d3.formatLocale({ decimal: '.', currency: ['¥', ''] })

export default function applyTax (price, tax = 1, doFloor = true) {
  let nextPrice = price * tax

  if (doFloor) {
    nextPrice = Math.floor(nextPrice * 10) / 10
  }

  return ja.format('$.0f')(nextPrice)
}
