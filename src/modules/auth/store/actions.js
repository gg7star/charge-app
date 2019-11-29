import { Actions } from 'react-native-router-flux';
import * as types from './actionTypes'

export function tryLogin(countryCode, phoneNumber) {
  return {
    type: types.LOGIN_REQUEST,
    payload: { countryCode, phoneNumber }
  }
}

export function loginSuccess(accountInfo) {
  if (accountInfo.isFirst) {
    Actions['signup_hint_find_station'] ()
  } else {
    Actions['authorized']()
  }
  return {
    type: types.LOGIN_DONE,
    payload: { accountInfo }
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
    Actions['signup_hint_find_station'] ()
  } else {
    Actions['authorized']()
  }
  return {
    type: types.LOGIN_DONE,
    payload: { accountInfo }
  }
}