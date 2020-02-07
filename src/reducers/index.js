import { combineReducers } from 'redux';
import app from './appReducer';
import stripePayment from './stripeReducer';
import auth from './loginReducer';
import signup from './signupReducer';
import map from './mapReducer';
import profile from './profileReducer';
import rent from './rentReducer';

export default combineReducers({
  app,
  auth,
  map,
  profile,
  rent,
  signup,
  stripePayment
});
