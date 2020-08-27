import { rentActionTypes } from './types';

const types = rentActionTypes;

export function rentInit() {
  return {
    type: types.RENT_INIT
  }
}

export function rentStation({stationSn, uuid, pushToken, deviceType, onesignalUserId}) {
  return {
    type: types.RENT_REQUEST,
    payload: { stationSn, uuid, pushToken, deviceType, onesignalUserId }
  }
}

export function rentSuccess({tradeNo, powerBankSn, slotNum, stationSn, rentedPlaceAddress, msg}, auth) {
  return {
    type: types.RENT_SUCCESS,
    payload: { tradeNo, powerBankSn, slotNum, msg, stationSn, rentedPlaceAddress, auth}
  }
}

export function rentFailure({error}) {
  console.log('===== rentFailure');
  return {
    type: types.RENT_FAILURE,
    payload: { statusMessage: error }
  }
}

export function returnedBattery(rent) {
  return {
    type: types.RENT_RETURNED_BATTERY,
    payload: { rent }
  }
}

export function returnedBatteryFailed(rent, auth) {
  return {
    type: types.RENT_RETURNED_BATTERY_FAILED,
    payload: { rent, auth }
  }
}

export function requireFeedback() {
  return {
    type: types.RENT_REQUIRED_FEEDBACK
  }
}