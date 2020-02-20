import * as types from './types/profileActionTypes';
import moment from 'moment';
import messaging from '@react-native-firebase/messaging';

export function addCoupon(couponCode) {
  return {
    type: types.ADD_COUPON_REQUEST,
    payload: { couponCode }
  }
}

export function loadHistories(histories) {
  return {
    type: types.LOAD_HISTORY_REQUEST,
    payload: { histories }
  }
}

export function selectHistory(index) {
  return {
    type: types.SELECT_HISTORY,
    payload: { index }
  }
}

export function selectPayPrice(payment) {
  return {
    type: types.SELECT_PAY_PRICE,
    payload: { payment }
  }
}

export function addCreditCard(cardInfo) {
  return {
    type: types.ADD_CREDIT_CARD,
    payload: {cardInfo}
  }
}

export function addNotification(notification, data, isActive) {
  console.log('===== notification: ', notification, data, isActive);
  return {
    type: types.ADD_NOTIFICATION,
    payload: { notification :{...notification, date: moment().format('DD/MM/YY LT')} }
  }
}