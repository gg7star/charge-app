import React from 'react';
import { Scene } from 'react-native-router-flux';
import {
  HintFindStation,
  HintScanQr,
  HintSaved,
  HintBringback,
  HintRecommend
} from './index';

export default HintStack = (
  <Scene key='hint' hideNavBar>
    <Scene 
      key='signup_hint_find_station'
      hideNavBar
      component={HintFindStation}
    />
    <Scene 
      key='signup_hint_scan_qr'
      hideNavBar
      component={HintScanQr}
    />
    <Scene 
      key='signup_hint_saved'
      hideNavBar
      component={HintSaved}
    />
    <Scene 
      key='signup_hint_bringback'
      hideNavBar
      component={HintBringback}
    />
    <Scene 
      key='signup_hint_recommend'
      hideNavBar
      component={HintRecommend}
    />
  </Scene>
);
