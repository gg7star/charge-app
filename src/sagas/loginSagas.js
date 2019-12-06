import { put, takeLatest, call } from 'redux-saga/effects';
import { Actions } from 'react-native-router-flux';
import * as virtualAccount from '~/common/utils/virtualAccount';
import {loginActionTypes, mapActionTypes} from '~/actions/types';
// import { loginFirebaseService } from '~/common/services/firebase';
import { attemptSignInWithEmail } from '~/common/services/rn-firebase/auth';
import { getCurrentUserInfo } from '~/common/services/rn-firebase/database';
import { AppActions, LoginActions } from '~/actions';

const { setGlobalNotification } = AppActions;
const { loginSuccess, loginFailed } = LoginActions;

export default function* watcher() {
  yield takeLatest(loginActionTypes.LOGIN_REQUEST, tryLogin)
  yield takeLatest(loginActionTypes.FACEBOOK_LOGIN_REQUEST, tryLoginWithFacebook)
}

export function* tryLogin(action) {  
  const { countryCode, phoneNumber } = action.payload
  const fullPhoneNumber = `${countryCode}${phoneNumber}`
  const email = virtualAccount.getEmail(fullPhoneNumber)
  const password = virtualAccount.getPassword(fullPhoneNumber)
  var errorMessage = null;
  try {
    const result = yield call(attemptSignInWithEmail,{email, password})
    if (result.authInfo) {
      const userInfo = yield call(getCurrentUserInfo);
      if (userInfo) {
        yield put({ type: mapActionTypes.GET_ALL_STATIONS});
        yield put(loginSuccess({authInfo: result.authInfo, accountInfo: userInfo}));
        return;
      } else {
        errorMessage = 'account info does not exist';
      }
    } else {
      errorMessage = result.error;
    }
    yield put(loginFailed(errorMessage))
    yield put(setGlobalNotification({
      message: errorMessage,
      type: 'danger',
      duration: 6000
    }));
    return
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
  const { fbId } = action.payload;
  const email = virtualAccount.getEmailForFacebook(fbId);
  const password = virtualAccount.getPassword(fbId);

  try {
    // const accountInfo = yield call(
    //   loginFirebaseService.tryLogin,
    //   { userId: fbId, email, password }
    // );
    const accountInfo = yield call(attemptSignInWithEmail,{email, password})
    yield put(loginSuccess(accountInfo));
    yield put({ type: mapTypes.GET_ALL_STATIONS});
  } catch (e) {
    console.log('====== e: ', e);
    const errorMessage = 'Login failed. Input correct phone number.';
    yield put(loginFailed(errorMessage));
    yield put(setGlobalNotification({
      message: errorMessage,
      type: 'danger',
      duration: 6000
    }));
  }
}
