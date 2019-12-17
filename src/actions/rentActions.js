import { rentActionTypes } from './types';

const types = rentActionTypes;

export function rentStation({stationSn, uuid, pushToken, deviceType}) {
  return {
    type: types.RENT_REQUEST,
    payload: { stationSn, uuid, pushToken, deviceType }
  }
}

export function rentSuccess({tradeNo, powerBankSn, slotNum, msg}) {
  return {
    type: types.RENT_SUCCESS,
    payload: { tradeNo, powerBankSn, slotNum, msg }
  }
}

export function rentFailure({error}) {
  return {
    type: types.RENT_FAILURE,
    payload: { statusMessage: error }
  }
}