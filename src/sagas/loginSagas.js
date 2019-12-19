import { put, takeLatest, call } from 'redux-saga/effects';
import { Actions } from 'react-native-router-flux';
import * as virtualAccount from '~/common/utils/virtualAccount';
import {loginActionTypes, mapActionTypes} from '~/actions/types';
import { attemptSignInWithEmail } from '~/common/services/rn-firebase/auth';
import { getCurrentUserInfo } from '~/common/services/rn-firebase/database';
import { createFcmToken, saveFcmToken, startReceiveFcm } from '~/common/services/rn-firebase/message';
import { AppActions, LoginActions, RentActions } from '~/actions';

const { setGlobalNotification } = AppActions;
const { loginSuccess, loginFailed, setFcmToken, setFcmListener } = LoginActions;
const { rentSuccess } = RentActions;

export default function* watcher() {
  yield takeLatest(loginActionTypes.LOGIN_REQUEST, tryLoginWithPhoneNumber);
  yield takeLatest(loginActionTypes.FACEBOOK_LOGIN_REQUEST, tryLoginWithFacebook);
  // yield takeLastest(loginActionTypes.RECEIVED_FCM, receivedFcm);
}

function receivedFcm(fcmMsg) {
  console.log('==== receivedFcm: fcmMsg: ', fcmMsg);
  if(fcmMsg.type === 'lend_result') {
    rentSuccess({...fcmMsg.data});
    Actions['map_first']({initialModal: 'rent'});
  }
}

function* commonLogin({email, password}) {
  var errorMessage = null;
  try {
    const result = yield call(attemptSignInWithEmail,{email, password})
    if (result.authInfo) {
      const userInfo = yield call(getCurrentUserInfo);
      if (userInfo) {
        yield put({ type: mapActionTypes.GET_ALL_STATIONS});
        yield put(loginSuccess({authInfo: result.authInfo, accountInfo: userInfo}));
        console.log('===== loginSuccess');
        if (userInfo.isFirst) {
          console.log('===== loginSuccess go to userInfo.isFirst')
          Actions['signup_hint_find_station'] ();
        } else {
          console.log('===== loginSuccess and go to map')
          Actions.map();
        }

        const fcmToken = yield call(createFcmToken);
        yield put(setFcmToken(fcmToken));
        const res = yield call(saveFcmToken, result.authInfo.user.uid, fcmToken);
        const fcmListener = startReceiveFcm(receivedFcm);
        console.log('====== fcmListener: ', fcmListener);
        yield put(setFcmListener(fcmListener));
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

export function* tryLoginWithPhoneNumber(action) {  
  const { countryCode, phoneNumber } = action.payload
  const fullPhoneNumber = `${countryCode}${phoneNumber}`
  const email = virtualAccount.getEmail(fullPhoneNumber)
  const password = virtualAccount.getPassword(fullPhoneNumber)
  yield commonLogin({email, password});
}

export function* tryLoginWithFacebook(action) {  
  const { fbId, fbProfile } = action.payload;
  const email = virtualAccount.getEmailForFacebook(fbId);
  const password = virtualAccount.getPassword(fbId);
  yield commonLogin({email, password});
  // try {
  //   // const accountInfo = yield call(
  //   //   loginFirebaseService.tryLogin,
  //   //   { userId: fbId, email, password }
  //   // );
  //   const authInfo = yield call(attemptSignInWithEmail,{email, password});
  //   const accountInfo = yield call()
  //   yield put(loginSuccess({authInfo, accountInfo}));
  //   yield put({ type: mapActionTypes.GET_ALL_STATIONS});
  //   if (accountInfo.isFirst) {
  //     console.log('===== loginSuccess go to accountInfo.isFirst')
  //     Actions['signup_hint_find_station'] ();
  //   } else {
  //     console.log('===== facebook loginSuccess and go to map')
  //     Actions.map();
  //   }
  // } catch (e) {
  //   console.log('====== e: ', e);
  //   const errorMessage = 'Login failed. Input correct phone number.';
  //   yield put(loginFailed(errorMessage));
  //   yield put(setGlobalNotification({
  //     message: errorMessage,
  //     type: 'danger',
  //     duration: 6000
  //   }));
  // }
}
