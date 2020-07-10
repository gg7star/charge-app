import React from 'react';
import { Scene, Stack } from 'react-native-router-flux';
import FirstScreen from '~/modules/map/screens/first/ViewContainer';
import GiftScreen from '~/modules/map/screens/gift/ViewContainer';
import ScanQrScreen from '~/modules/map/screens/scan-qr/ViewContainer';
import EnterCodeScreen from '~/modules/map/screens/enter-code/ViewContainer';
import AdmobScreen from '~/modules/map/screens/admob/ViewContainer';

const MapStack = (
  <Scene key={'map'} >
    <Scene 
      key='map_first'
      hideNavBar
      component={FirstScreen}
    />
    <Scene 
      key='map_scan_qr'
      hideNavBar
      component={ScanQrScreen}
    />
    <Scene 
      key='map_gift'
      hideNavBar
      component={GiftScreen}
    />
    <Scene 
      key='map_enter_code'
      hideNavBar
      component={EnterCodeScreen}
    />
    <Scene 
      key='admob'
      hideNavBar
      component={AdmobScreen}
    />
  </Scene>
)

export default MapStack;
