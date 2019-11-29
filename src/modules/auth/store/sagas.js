import { put, takeEvery, takeLatest, call } from 'redux-saga/effects'
import { Actions } from 'react-native-router-flux'
import * as types from './actionTypes'
import * as mapTypes from '../../map/store/actionTypes'
import * as firebaseService from '../common/services/firebase'
import * as virtualAccount from '../common/utils/virtualAccount'
import { setGlobalNotification } from '~/root/app/store/actions';
import { loginSuccess, loginFailed } from './actions';

export default function* watcher() {
  yield takeLatest(types.LOGIN_REQUEST, tryLogin)
  yield takeLatest(types.FACEBOOK_LOGIN_REQUEST, tryLoginWithFacebook)
}

export function* tryLogin(action) {  
  const { countryCode, phoneNumber } = action.payload
  const fullPhoneNumber = `${countryCode}${phoneNumber}`
  const email = virtualAccount.getEmail(fullPhoneNumber)
  const password = virtualAccount.getPassword(fullPhoneNumber)
  
  try {
    const accountInfo = yield call(firebaseService.tryLogin, { userId: fullPhoneNumber, email, password })
    yield put(loginSuccess(accountInfo))
    yield put({ type: mapTypes.GET_ALL_STATIONS})    
  } catch (e) {
    console.log('====== e: ', e)
    const errorMessage = 'Login failed. Input correct phone number.';
    yield put(loginFailed(errorMessage))
    yield put(setGlobalNotification({
      message: errorMessage,
      type: 'danger',
      duration: 6000
    }));
  }
}

export function* tryLoginWithFacebook(action) {  
  const { fbId } = action.payload
  const email = virtualAccount.getEmailForFacebook(fbId)
  const password = virtualAccount.getPassword(fbId)

  try {
    const accountInfo = yield call(firebaseService.tryLogin, { userId: fbId, email, password })
    yield put(loginSuccess(accountInfo))
    yield put({ type: mapTypes.GET_ALL_STATIONS})    
  } catch (e) {
    console.log('====== e: ', e)
    const errorMessage = 'Login failed. Input correct phone number.';
    yield put(loginFailed(errorMessage))
    yield put(setGlobalNotification({
      message: errorMessage,
      type: 'danger',
      duration: 6000
    }));
  }
}
