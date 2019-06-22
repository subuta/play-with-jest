import * as d3 from 'd3-format'

// Format as japanese currency.
const ja = d3.formatLocale({ decimal: '.', currency: ['¥', ''] })

const getDefaultTax = () => {
  const now = new Date()

  // SEE: https://www.nta.go.jp/m/taxanswer/6303.htm
  // month = 9 means October in JavaScript :(
  const taxChangeDate = new Date(2019, 9, 1)
  if (taxChangeDate <= now) {
    // Sales tax = 10% after 2019/10/1
    return 1.1
  }

  // Sales tax = 8% until 2019/10/1
  return 1.08
}

export default function applyTax (price, tax, doFloor = true) {
  if (!tax) {
    tax = getDefaultTax()
  }

  let nextPrice = price * tax

  if (doFloor) {
    nextPrice = Math.floor(nextPrice * 10) / 10
  }

  return ja.format('$.0f')(nextPrice)
}
