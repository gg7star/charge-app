import { Actions } from 'react-native-router-flux';
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


export function registerCardRequest(data) {
  return {
    type: types.REGISTER_CARD_REQUEST,
    payload: {
      ...data
    }
  };
}

export function registerCardSuccess(result) {
  return {
    type: types.REGISTER_CARD_SUCCESS,
    payload: {
      result
    }
  };
}

export function registerCardFailure(result) {
  return {
    type: types.REGISTER_CARD_FAILURE,
    payload: {
      result
    }
  };
}