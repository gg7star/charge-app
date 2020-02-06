import React from 'react';
import { Scene } from 'react-native-router-flux';
import {
  SetName,
  SetEmail,
  SetBirthday
} from './index';

export default SetUserInfoStack = (
  <Scene key='set_user_info' hideNavBar>
    <Scene 
      key='signup_set_name'
      hideNavBar
      component={SetName}
    />
    <Scene 
      key='signup_set_email'
      hideNavBar
      component={SetEmail}
    />
    <Scene 
      key='signup_set_birthday'
      hideNavBar
      component={SetBirthday}
    />
  </Scene>
);
