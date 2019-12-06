import { put, takeLatest } from 'redux-saga/effects';
import { Actions } from 'react-native-router-flux';
import { profileFirebaseService } from '~/common/services/firebase';
import { profileActionTypes } from '~/actions/types';

export default function* watcher() {  
  yield takeLatest(profileActionTypes.ADD_COUPON_REQUEST, addCoupon)
  yield takeLatest(profileActionTypes.LOAD_HISTORY_REQUEST, loadHistories)
}

export function* addCoupon(action) {
  const { couponCode } = action.payload

  try {
    profileFirebaseService.addCoupon({ couponCode })
    yield put({ type: profileActionTypes.ADD_COUPON_SUCCESS, payload: { couponCode } })
    Actions['profile_wallet']()
  } catch (e) {
    yield put({ type: profileActionTypes.ADD_COUPON_FAILURE })
  }
}

export function* loadHistories(action) {
  try {
    const histories = profileFirebaseService.loadHistories();
    console.log('ddddssd')
    console.log(histories)
    yield put({ type: profileActionTypes.LOAD_HISTORY_SUCCESS, payload: { histories } })
  } catch (e) {
    yield put({ type: profileActionTypes.LOAD_HISTORY_FAILURE })
  }
}