import { all } from 'redux-saga/effects'
import auth from '~/modules/auth/store/sagas';
import auth_signup from '~/modules/auth_signup/store/sagas';
import map from '~/modules/map/store/sagas';
import profile from '~/modules/profile/store/sagas';
import stripe from '~/root/stripe/store/sagas';

// Consider using takeEvery
export default function* root() {
  yield all([
    auth(),
    auth_signup(),    
    map(),
    profile(),
    stripe()
  ])
}
