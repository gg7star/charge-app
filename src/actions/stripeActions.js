import * as types from './types/stripeActionTypes';

export function initStripe() {
  return {
    type: types.DO_PAYMENT_INIT,
    payload: {}
  }
}

export function doPaymentRequest(data) {
  return {
    type: types.DO_PAYMENT_REQUEST,
    payload: {
      ...data
    }
  };
}

export function doPaymentSuccess(result) {
  return {
    type: types.DO_PAYMENT_SUCCESS,
    payload: {
      result
    }
  };
}

export function doPaymentFailure(result) {
  return {
    type: types.DO_PAYMENT_FAILURE,
    payload: {
      result
    }
  };
}