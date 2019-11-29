import { put, takeLatest, call } from 'redux-saga/effects';
import * as types from './actionTypes';
import * as firebaseService from '../common/services/firebase';
import * as authTypes from '../../auth/store/actionTypes';
import * as virtualAccount from '../../auth/common/utils/virtualAccount';
import { processRequest } from '../../../common/services/api';
import serverUrls from '../../../common/constants/api';
import {
  requestConfirmCodeSuccess,
  requestConfirmCodeFailed
} from './actions';
import { setGlobalNotification } from '~/root/app/store/actions';

export default function* watcher() {
  yield takeLatest(types.SET_PHONE_NUMBER, requestVerificationCode);
  yield takeLatest(types.SEND_CONFIRM_CODE, sendConfirmCode);
  yield takeLatest(types.SIGNUP_REQUEST, trySignup);
  yield takeLatest(types.FACEBOOK_SIGNUP_SUCCESS, tryRegisterFbUserToFirebase);
}

export function* requestVerificationCode(action) {
  try {
    const { countryCode, phoneNumber } = action.payload;
    const requestPayload = {
      to_telnumber: `+${countryCode}${phoneNumber}`
    };

    const response = yield call(processRequest, `${serverUrls.apiGatewayServerURL}/mailjet/send_sms`, 'POST', requestPayload);
    let data = {
      confirmCode: response.data.message.verification_code,
      ...response.data,
    }
    console.log('===== data: ', data)
    if (data.status == 200) {
      const mailjetSmsCode = data.message.res.Status.Code;
      if (mailjetSmsCode >= 1 && mailjetSmsCode <= 3 ) {
        yield put(requestConfirmCodeSuccess(data));
        yield put(setGlobalNotification({
          message: `This app sent a confirm code via SMS. Please check your phone.`, type: 'success', duration: 6000
        }));
      } else {
        const errorDesctription = data.message.res.Status.Description;
        yield put(requestConfirmCodeFailed(data));
        yield put(setGlobalNotification({
          message: `Failed to send confirm code. ${errorDesctription}`,
          type: 'danger',
          duration: 6000
        }));
      }
    } else {
      yield put(requestConfirmCodeFailed(data));
      console.log('==== data: ', data);
      yield put(setGlobalNotification({
        message: `Failed to send confirm code.`,
        type: 'danger',
        duration: 6000
      }));
    }
  } catch(error) {
    console.log('===== signup: error: ', error);
    yield put(requestConfirmCodeFailed(error.data || 'Failed to send confirm code via SMS.'));
    yield put(setGlobalNotification({
      message: error && error.data 
        ? error.data.message.res.ErrorMessage
        : 'Failed to send confirm code via SMS.',
      type: 'danger',
      duration: 6000
    }));
  }
}

export function* sendConfirmCode(action) {
  const confirmCode = virtualAccount.getConfirmCode(action.payload.phoneNumber)
  console.log(confirmCode)
  // send confirm code by sms
  yield put({ type: types.SET_CONFIRM_CODE, payload: { confirmCode } })
}

export function* trySignup(action) {
  const { accountInfo } = action.payload
  const { countryCode, phoneNumber } = accountInfo
  console.log('===== trySignup: countryCode: ', countryCode)
  const fullPhoneNumber = `${countryCode}${phoneNumber}`
  const email = virtualAccount.getEmail(fullPhoneNumber)
  const password = virtualAccount.getPassword(fullPhoneNumber)

  try {
    console.log('===== accountInfo: ', accountInfo);
    yield call(firebaseService.trySignup, { email, password, accountInfo})
    yield put({ type: types.SIGNUP_SUCCESS, payload: { statusMessage: 'Signup success.' } })
    yield put({ type: authTypes.LOGIN_REQUEST, payload: { countryCode, phoneNumber } })
  } catch (e) {
    console.log('===== e: ', e)
    var errorMessage = e.message
    if(e.code === 'auth/email-already-in-use')
      errorMessage = 'The phone number is already registered. Please try again with other phone number.'
    yield put({ type: types.SIGNUP_FAILURE, payload: { statusMessage: errorMessage } })
  }
}

export function* tryRegisterFbUserToFirebase(action) {
  const { fbProfile } = action.payload
  const email = virtualAccount.getEmailForFacebook(fbProfile.id)
  const password = virtualAccount.getPassword(fbProfile.id)
  try {
    console.log('===== fbProfile: ', fbProfile);
    yield call(firebaseService.trySignupWithFacebook, { email, password, fbProfile })
    yield put({ type: types.SIGNUP_SUCCESS, payload: { statusMessage: 'Signup success.' } })
    yield put({ type: authTypes.FACEBOOK_LOGIN_REQUEST, payload: { fbId: fbProfile.id } })
  } catch (e) {
    console.log('===== e: ', e)
    var errorMessage = e.messageon
    if(e.code === 'auth/email-already-in-use') {
      errorMessage = 'You was already registered with your facebook account. Please login with your facebook account.'
      yield put({ type: types.SIGNUP_SUCCESS, payload: { statusMessage: 'Signup success.' } })
      yield put({ type: authTypes.FACEBOOK_LOGIN_REQUEST, payload: { fbId: fbProfile.id } })
      return;
    }
    yield put({ type: types.SIGNUP_FAILURE, payload: { statusMessage: errorMessage } })
  }
}