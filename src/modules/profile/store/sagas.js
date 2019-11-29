import { put, takeEvery, takeLatest, call, delay } from 'redux-saga/effects'
import * as types from './actionTypes'
import * as firebaseService from '../common/services/firebase'
import { Actions } from 'react-native-router-flux'

export default function* watcher() {  
  yield takeLatest(types.ADD_COUPON_REQUEST, addCoupon)
  yield takeLatest(types.LOAD_HISTORY_REQUEST, loadHistories)
}

export function* addCoupon(action) {
  const { couponCode } = action.payload

  try {
    firebaseService.addCoupon({ couponCode })
    yield put({ type: types.ADD_COUPON_SUCCESS, payload: { couponCode } })
    Actions['profile_wallet']()
  } catch (e) {
    yield put({ type: types.ADD_COUPON_FAILURE })
  }
}

export function* loadHistories(action) {
  try {
    const histories = firebaseService.loadHistories();
    console.log('ddddssd')
    console.log(histories)
    yield put({ type: types.LOAD_HISTORY_SUCCESS, payload: { histories } })
  } catch (e) {
    yield put({ type: types.LOAD_HISTORY_FAILURE })
  }
}