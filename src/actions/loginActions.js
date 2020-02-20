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
    payload: { fcmToken }
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

export function setOnesignalDevice(oneSignalDevice) {
  console.log('===== OneSignal Device: ', oneSignalDevice);
  return {
    type: types.SET_ONE_SIGNAL_DEVICE,
    payload: { oneSignalDevice }
  }
}

export function loginSuccess(credential) {
  return {
    type: types.LOGIN_SUCCESS,
    payload: { credential }
  }
}

export function loginSuccessWithSocial(credential, auth) {
  return {
    type: types.SOCIAL_LOGIN_SUCCESS,
    payload: { credential, auth }
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

export function loadPrevState(prevState) {
  return {
    type: types.LOGIN_LOAD_PREV_STATE,
    payload: { prevState }
  }
}

export function updatedUserInfo(userInfo) {
  return {
    type: types.UPDATED_USER_INFO,
    payload: { userInfo }
  }
}