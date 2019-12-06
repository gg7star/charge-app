const histories = require('~/common/config/histories.json')

export function addCoupon({ couponCode }) {
  return { result: 'success' }
}


export function loadHistories() {
  return histories;
}