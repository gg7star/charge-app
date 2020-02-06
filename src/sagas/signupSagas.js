import { put, takeLatest, call } from 'redux-saga/effects';
import { Actions } from 'react-native-router-flux';
import * as virtualAccount from '~/common/utils/virtualAccount';
import { loginActionTypes, signupActionTypes } from '~/actions/types';
import { AppActions, SignupActions } from '~/actions';
import { attempSignup } from '~/common/services/rn-firebase/signup';
import { loginWithPhone } from '~/common/services/rn-firebase/auth';
import { createAccount } from '~/common/services/rn-firebase/database';


export default function* watcher() {
  const types = signupActionTypes;
  yield takeLatest(types.SET_NAME, processSetName);
}

export function* processSetName(action) {
  console.log('==== go to signup_set_email');
  // Actions['signup_set_email']();
}