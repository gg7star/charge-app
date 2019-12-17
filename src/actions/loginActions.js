import { Actions } from 'react-native-router-flux';
import * as types from './types/loginActionTypes'

export function initLogin() {
  return {
    type: types.LOGIN_INIT
  }
}

export function setFcmToken(fcmToken) {
  return {
    type: types.SET_FCM_TOKEN,
    payload: {fcmToken}
  }
}

export function setFcmListener(fcmListener) {
  return {
    type: types.SET_FCM_LISTENER,
    payload: {fcmListener: fcmListener}
  }
}

export function receivedFcm(message) {
  return {
    type: types.RECEIVED_FCM,
    payload: { message }
  }
}

export function tryLogin(countryCode, phoneNumber) {
  return {
    type: types.LOGIN_REQUEST,
    payload: { countryCode, phoneNumber }
  }
}

export function loginSuccess({authInfo, accountInfo}) {
  return {
    type: types.LOGIN_DONE,
    payload: {authInfo, accountInfo}
  }
}

export function loginCanceled() {
  return {
    type: types.LOGIN_CANCELED
  }
}

export function loginFailed(errorMessage) {
  return {
    type: types.LOGIN_FAILURE,
    payload: {
      statusMessage: errorMessage
    }
  }
}

export function clearMessage() {
  return {
    type: types.CLEAR_MESSAGE
  }
}

export function doLogout() {
  return {
    type: types.LOGOUT_DONE
  }
}

export function tryLoginWithFacebook() {
  return {
    type: types.TRY_FACEBOOK_LOGIN_REQUEST,
  }
}

export function loginWithFacebook(fbId) {
  return {
    type: types.FACEBOOK_LOGIN_REQUEST,
    payload: { fbId }
  }
}

export function loginWithFacebookSuccess(accountInfo) {
  if (accountInfo.isFirst) {
    Actions['signup_hint_find_station'] ();
  } else {
    // Actions['authorized']();
    Actions.map();
    Actions['map_first']();
  }
  return {
    type: types.LOGIN_DONE,
    payload: { accountInfo }
  }
}