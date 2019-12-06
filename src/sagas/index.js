import { all } from 'redux-saga/effects'
import auth from './loginSagas';
import auth_signup from './signupSagas';
import map from './mapSagas';
import profile from './profileSagas';
import stripe from './stripeSagas';

export default function* root() {
  yield all([
    auth(),
    auth_signup(),    
    map(),
    profile(),
    stripe()
  ])
}
