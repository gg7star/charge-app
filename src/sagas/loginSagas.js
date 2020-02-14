import { takeLatest, call, put } from 'redux-saga/effects';
import { Actions } from 'react-native-router-flux';
import { LOAD } from 'redux-storage';
import { loginActionTypes } from '~/actions/types';
import { PhoneAuth } from '~/common/services/rn-firebase/auth';
import {
  createAccount,
  createSocialAccount,
  checkIfUserExistsByPhoneNumber
} from '~/common/services/rn-firebase/database';

import { createFcmToken, saveFcmToken, startReceiveFcm } from '~/common/services/rn-firebase/message';
import { AppActions, LoginActions, RentActions, MapActions } from '~/actions';

const { updatedUserInfo } = LoginActions;
const { rentSuccess } = RentActions;

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
    const { providerData, displayName } = action.payload.auth.credential.user;
    const authProvider = (providerData && providerData[0]) ? providerData[0].providerId : null;
    if((authProvider === PhoneAuth.AUTH_PROVIDER) && !displayName)
      Actions['set_user_info']();
    else Actions['home']();
  }
}

export function* processLoginSuccess(action) {
  const { credential } = action.payload;
  const phoneNumber = credential.user.phoneNumber;
  var providerData = null;
  var email = null;
  var authProvider = null;

  var user = yield call(checkIfUserExistsByPhoneNumber, phoneNumber);
  if (!user) {
    user = yield call(createAccount, credential);
    console.log('===== createAccount: ', user);
  } else {
    const { displayName, email, birthday } = user;
    const userInfo = { displayName, email, birthday };
    yield put(updatedUserInfo(userInfo));
  }

  if (user) {
    const { providerData, email } = user;
    const authProvider = providerData[0] ? providerData[0].providerId : null;

    if((authProvider === PhoneAuth.AUTH_PROVIDER) && !email)
      Actions['set_user_info']();
    else Actions['home']();
  }
}

export function* processSocialLoginSuccess(action) {
  const { credential } = action.payload;
  const resCreateUser = yield call(createSocialAccount, credential);
  if(resCreateUser) {
    if(
      credential.additionalUserInfo && 
      credential.additionalUserInfo.isNewUser
    ) Actions['hint']();
    // else Actions['hint']();
    else Actions['home']();
  };
}

function receivedFcm(fcmMsg) {
  console.log('==== receivedFcm: fcmMsg: ', fcmMsg);
  if(fcmMsg.type === 'lend_result') {
    rentSuccess({...fcmMsg.data});
    Actions['map_first']({initialModal: 'rent'});
  }
}
