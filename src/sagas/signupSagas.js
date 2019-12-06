import { put, takeLatest, call } from 'redux-saga/effects';
import { signupFirebaseService } from '~/common/services/firebase';
import * as virtualAccount from '~/common/utils/virtualAccount';
import { processRequest } from '~/common/services/api';
import serverUrls from '~/common/constants/api';
import { loginActionTypes, signupActionTypes } from '~/actions/types';
import { AppActions, SignupActions } from '~/actions';
import { attempSignup } from '~/common/services/rn-firebase/signup';
import {
  createAccount,
  createFacebookAccount
} from '~/common/services/rn-firebase/database';

const { requestConfirmCodeSuccess, requestConfirmCodeFailed } = SignupActions;
const { setGlobalNotification } = AppActions;

export default function* watcher() {
  const types = signupActionTypes;
  yield takeLatest(types.SET_PHONE_NUMBER, requestVerificationCode);
  yield takeLatest(types.SIGNUP_REQUEST, trySignup);
  yield takeLatest(types.FACEBOOK_SIGNUP_SUCCESS, tryRegisterFbUserToFirebase);
}

export function* requestVerificationCode(action) {
  try {
    const { countryCode, phoneNumber } = action.payload;
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;
    const requestPayload = {
      to_telnumber: `+${fullPhoneNumber}`
    };
    // Firstly, check user on database
    // const email = virtualAccount.getEmail(fullPhoneNumber);
    // const password = virtualAccount.getPassword(fullPhoneNumber);
    // const res = yield call(attempSignup, {email, password});
    // console.log('====== attempSignup: ', res);
    // if (res.error) {
    //   yield put(requestConfirmCodeFailed(res));
    //   yield put(setGlobalNotification({
    //     message: res.error,
    //     type: 'danger',
    //     duration: 6000
    //   }));
    //   return
    // }
    // Send confirm code request
    const response = yield call(
      processRequest,
      `${serverUrls.apiGatewayServerURL}/mailjet/send_sms`,
      'POST',
      requestPayload
    );
    let data = {
      confirmCode: response.data.message.verification_code,
      ...response.data,
    };
    if (data.status == 200) {
      const mailjetSmsCode = data.message.res.Status.Code;
      if (mailjetSmsCode >= 1 && mailjetSmsCode <= 3 ) {
        yield put(requestConfirmCodeSuccess(data));
        yield put(setGlobalNotification({
          message: `This app sent a confirm code via SMS. Please check your phone.`, type: 'success', duration: 6000
        }));
      } else {
        const errorDesctription = data.message.res.Status.Description;
        // yield put(requestConfirmCodeFailed(data));
        // yield put(setGlobalNotification({
        //   message: `Failed to send confirm code. ${errorDesctription}`,
        //   type: 'danger',
        //   duration: 6000
        // }));
        // For test
        yield put(requestConfirmCodeSuccess(data));
      }
    } else {
      // yield put(requestConfirmCodeFailed(data));
      // console.log('==== data: ', data);
      // yield put(setGlobalNotification({
      //   message: `Failed to send confirm code.`,
      //   type: 'danger',
      //   duration: 6000
      // }));
      // For test
      yield put(requestConfirmCodeSuccess(data));
    }
  } catch(error) {
    console.log('===== signup: error: ', error);
    // yield put(requestConfirmCodeFailed(error.data || 'Failed to send confirm code via SMS.'));
    // yield put(setGlobalNotification({
    //   message: error && error.data 
    //     ? error.data.message.res.ErrorMessage
    //     : 'Failed to send confirm code via SMS.',
    //   type: 'danger',
    //   duration: 6000
    // }));
    // For test
    let data = {
      confirmCode: error.data.message.verification_code,
      ...error.data,
    };
    yield put(requestConfirmCodeSuccess(data));
  }
}

export function* sendConfirmCode(action) {
  // const confirmCode = virtualAccount.getConfirmCode(action.payload.phoneNumber);
  // console.log('==== confirmCode: ', confirmCode);
  // // send confirm code by sms
  // yield put({
  //   type: types.SET_CONFIRM_CODE,
  //   payload: {confirmCode}
  // });
}

export function* trySignup(action) {
  const { accountInfo } = action.payload;
  const { countryCode, phoneNumber } = accountInfo;
  const fullPhoneNumber = `${countryCode}${phoneNumber}`;
  const email = virtualAccount.getEmail(fullPhoneNumber);
  const password = virtualAccount.getPassword(fullPhoneNumber);
  var errorMessage = null;
  try {
    const res = yield call(attempSignup, { email, password});
    if (res.data) {
      const resCreateUser = yield call(createAccount, accountInfo);
      console.log('==== resCreateUser: ', resCreateUser);
      // if (resCreateUser) {
        yield put({
          type: signupActionTypes.SIGNUP_SUCCESS,
          payload: {statusMessage: 'Signup success.'}
        });
        yield put({
          type: loginActionTypes.LOGIN_REQUEST,
          payload: {countryCode, phoneNumber}
        });
        return;  
      // } else errorMessage = 'Can\'t add account';
    } else errorMessage = res.error;

    yield put({
      type: signupActionTypes.SIGNUP_FAILURE,
      payload: {statusMessage: errorMessage}
    });
    return;
  } catch (e) {
    console.log('===== e: ', e);
    var errorMessage = e.message;
    if(e.code === 'auth/email-already-in-use')
      errorMessage = 'The phone number is already registered. Please try again with other phone number.';
    yield put({
      type: signupActionTypes.SIGNUP_FAILURE,
      payload: {statusMessage: errorMessage}
    });
  }
}

export function* tryRegisterFbUserToFirebase(action) {
  const { fbProfile } = action.payload;
  const email = virtualAccount.getEmailForFacebook(fbProfile.id);
  const password = virtualAccount.getPassword(fbProfile.id);

  try {
    const res = yield call(attempSignup, { email, password});
    if (res.data) {
      const resCreateUser = yield call(createFacebookAccount, fbProfile);
      console.log('==== resCreateUser: ', resCreateUser);
      yield put({
        type: signupActionTypes.SIGNUP_SUCCESS,
        payload: {statusMessage: 'Signup success.'}
      });
      yield put({
        type: loginActionTypes.LOGIN_REQUEST,
        payload: {countryCode, phoneNumber}
      });
      return;  
    } else errorMessage = res.error;

    yield put({
      type: signupActionTypes.SIGNUP_FAILURE,
      payload: {statusMessage: errorMessage}
    });
    return;
  } catch (e) {
    console.log('===== e: ', e);
    var errorMessage = e.message;
    if(e.code === 'auth/email-already-in-use')
      errorMessage = 'The phone number is already registered. Please try again with other phone number.';
    yield put({
      type: signupActionTypes.SIGNUP_FAILURE,
      payload: {statusMessage: errorMessage}
    });
  }
}