import { takeLatest, call } from 'redux-saga/effects';
import { Actions } from 'react-native-router-flux';
import { loginActionTypes } from '~/actions/types';
import { PhoneAuth } from '~/common/services/rn-firebase/auth';
import {
  createAccount,
  createSocialAccount
} from '~/common/services/rn-firebase/database';

import { createFcmToken, saveFcmToken, startReceiveFcm } from '~/common/services/rn-firebase/message';
import { AppActions, LoginActions, RentActions, MapActions } from '~/actions';

const { setGlobalNotification } = AppActions;
const { loginSuccess, loginFailed, setFcmToken, setFcmListener } = LoginActions;
const { getAllStations } = MapActions;
const { rentSuccess } = RentActions;
import { LOAD } from 'redux-storage';

export default function* watcher() {
  yield takeLatest(LOAD, processLoadDataOnFirstRunning);
  yield takeLatest(loginActionTypes.LOGIN_SUCCESS, processLoginSuccess);
  yield takeLatest(loginActionTypes.SOCIAL_LOGIN_SUCCESS, processSocialLoginSuccess);
  // yield takeLastest(loginActionTypes.RECEIVED_FCM, receivedFcm);
}

export function* processLoadDataOnFirstRunning(action) {
  if (
    action.payload && action.payload.auth &&
    action.payload.auth.credential && action.payload.auth.credential.user
  ) {
    const { providerData, email } = action.payload.auth.credential.user;
    const authProvider = providerData[0] ? providerData[0].providerId : null;
    if((authProvider === PhoneAuth.AUTH_PROVIDER) && !email)
      Actions['set_user_info']();
    else Actions['home']();
  }
}

export function* processLoginSuccess(action) {
  const { credential } = action.payload;
  
  const resCreateUser = yield call(createAccount, credential);
  console.log('===== resCreateUser: ', resCreateUser);
  if(resCreateUser) {
    const { providerData, email } = resCreateUser;
    const authProvider = providerData[0] ? providerData[0].providerId : null;
    if((authProvider === PhoneAuth.AUTH_PROVIDER) && !email)
      Actions['set_user_info']();
    else Actions['home']();
  }
}

export function* processSocialLoginSuccess(action) {
  const { credential } = action.payload;
  const resCreateUser = yield call(createSocialAccount, credential);
  if(resCreateUser) Actions['home']();
}

function receivedFcm(fcmMsg) {
  console.log('==== receivedFcm: fcmMsg: ', fcmMsg);
  if(fcmMsg.type === 'lend_result') {
    rentSuccess({...fcmMsg.data});
    Actions['map_first']({initialModal: 'rent'});
  }
}
