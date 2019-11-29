import React from 'react'
import { Scene, Stack } from 'react-native-router-flux'
import FirstScreen from './screens/first/ViewContainer'
import GiftScreen from './screens/gift/ViewContainer'
import ScanQrScreen from './screens/scan-qr/ViewContainer'
import EnterCodeScreen from './screens/enter-code/ViewContainer'

const MapStack = (
  <Stack key={'map'} >
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
  </Stack>
)

export default MapStack
