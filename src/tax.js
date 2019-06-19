export default function tax(price, doFloor = true) {
  return price + (price * 0.08);
}
