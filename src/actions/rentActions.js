import { rentActionTypes } from './types';

const types = rentActionTypes;

export function rentStation({stationSn, uuid, pushToken, deviceType, onesignalUserId}) {
  return {
    type: types.RENT_REQUEST,
    payload: { stationSn, uuid, pushToken, deviceType, onesignalUserId }
  }
}

export function rentSuccess({tradeNo, powerBankSn, slotNum, msg}, auth) {
  return {
    type: types.RENT_SUCCESS,
    payload: { tradeNo, powerBankSn, slotNum, msg , auth}
  }
}

export function rentFailure({error}) {
  console.log('===== rentFailure');
  return {
    type: types.RENT_FAILURE,
    payload: { statusMessage: error }
  }
}

export function returnedButtery(rent, auth) {
  return {
    type: types.RENT_RETURNED_BUTTERY,
    payload: { rent, auth }
  }
}