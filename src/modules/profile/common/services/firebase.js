const histories = require('./histories.json')

export function addCoupon({ couponCode }) {
  return { result: 'success' }
}


export function loadHistories() {
  return histories;
}