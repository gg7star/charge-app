import { combineReducers } from 'redux';
import app from './appReducer';
import stripe from './stripeReducer';
import auth from './loginReducer';
import signup from './signupReducer';
import map from './mapReducer';
import profile from './profileReducer';

export default combineReducers({
  app,
  auth,
  map,
  profile,
  signup,
  stripe
});
