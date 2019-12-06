import { Actions } from 'react-native-router-flux';
import * as types from './types/signupActionTypes';

export function initSignup() {
  return {
    type: types.SIGNUP_INIT
  }
}

export function setPhoneNumber(countryCode, phoneNumber) {
  return {
    type: types.SET_PHONE_NUMBER,
    payload: { countryCode, phoneNumber }
  }
}

export function requestConfirmCodeSuccess(data) {
  console.log('==== go to signup_set_confirm_code')
  Actions['signup_set_confirm_code']()
  return {
    type: types.REQUEST_CONFIRM_CODE_SUCCESS,
    payload: {
      confirmCode: data.confirmCode,
      data
    }
  }
}

export function requestConfirmCodeFailed(data) {
  return {
    type: types.REQUEST_CONFIRM_CODE_FAILED,
    payload: {
      confirmCode: data.message ? data.message.verification_code : '',
      data
    }
  }
}

export function sendConfirmCode(phoneNumber) {
  return {
    type: types.SEND_CONFIRM_CODE,
    payload: { phoneNumber }
  }
}

// export function setConfirmCode(confirmCode) {
//   return {
//     type: types.SET_CONFIRM_CODE,
//     payload: { confirmCode }
//   }
// }

export function setName(name) {
  return {
    type: types.SET_NAME,
    payload: { name }
  }
}

export function setEmail(email) {
  return {
    type: types.SET_EMAIL,
    payload: { email }
  }
}

export function setBirthday(birthday) {
  return {
    type: types.SET_BIRTHDAY,
    payload: { birthday }
  }
}

export function trySignup(accountInfo) {
  return {
    type: types.SIGNUP_REQUEST,
    payload: { accountInfo }
  }
}

export function clearMessage() {
  return {
    type: types.CLEAR_MESSAGE
  }
}

export function tryFbSignup() {
  return {
    type: types.FACEBOOK_SIGNUP_REQUEST
  }
}

export function fbSignupSuccess(fbProfile) {
  return {
    type: types.FACEBOOK_SIGNUP_SUCCESS,
    payload: {
      name: fbProfile.name,
      email: fbProfile.email,
      birthday: fbProfile.birthday || '',
      phoneNumber: fbProfile.phoneNumber || '',
      fbProfile: fbProfile,
      statusMessage: 'Signed up with Facebook successfully.'
    }
  }
}

export function fbSignupFailed(error) {
  return {
    type: types.FACEBOOK_SIGNUP_FAILED,
    payload: {
      statusMessage: error.message
    }
  }
}

export function fbSignupCanceled() {
  return {
    type: types.FACEBOOK_SIGNUP_CANCELED
  }
}