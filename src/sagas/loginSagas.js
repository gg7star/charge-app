import { put, takeLatest, call } from 'redux-saga/effects';
import { Actions } from 'react-native-router-flux';
import * as virtualAccount from '~/common/utils/virtualAccount';
import {loginActionTypes, mapActionTypes} from '~/actions/types';
import { attemptSignInWithEmail } from '~/common/services/rn-firebase/auth';
// import { getCurrentUserInfo } from '~/common/services/rn-firebase/database';
import {
  getCurrentUserInfo,
  createAccount,
  createSocialAccount
} from '~/common/services/rn-firebase/database';

import { createFcmToken, saveFcmToken, startReceiveFcm } from '~/common/services/rn-firebase/message';
import { AppActions, LoginActions, RentActions, MapActions } from '~/actions';

const { setGlobalNotification } = AppActions;
const { loginSuccess, loginFailed, setFcmToken, setFcmListener } = LoginActions;
const { getAllStations } = MapActions;
const { rentSuccess } = RentActions;

export default function* watcher() {
  yield takeLatest(loginActionTypes.LOGIN_SUCCESS, processLoginSuccess);
  // yield takeLatest(loginActionTypes.TRY_SOCIAL_LOGIN_REQUEST, processSocialLoginSuccess);
  // yield takeLastest(loginActionTypes.RECEIVED_FCM, receivedFcm);
}

export function* processLoginSuccess(action) {
  const { credential } = action.payload;
  const provider = credential.user.providerData[0].providerId;
  const isSocial = (provider === 'facebook.com');
  
  const resCreateUser = yield call(
    isSocial ? createSocialAccount : createAccount,
    credential
  );
  if(resCreateUser) Actions['home']();
}

export function* processSocialLoginSuccess(action) {
  const resCreateUser = yield call(
    createSocialAccount,
    { credential: action.payload.credential }
  );
  if(resCreateUser) Actions['home']();
}

function receivedFcm(fcmMsg) {
  console.log('==== receivedFcm: fcmMsg: ', fcmMsg);
  if(fcmMsg.type === 'lend_result') {
    rentSuccess({...fcmMsg.data});
    Actions['map_first']({initialModal: 'rent'});
  }
}
