import React from 'react'
import { Scene, Stack } from 'react-native-router-flux'
import FirstScreen from './screens/first/ViewContainer'
import SetConfirmCode from './screens/set-confirm-code/ViewContainer'
import SetName from './screens/set-name/ViewContainer'
import SetEmail from './screens/set-email/ViewContainer'
import SetBirthday from './screens/set-birthday/ViewContainer'
import HintFindStation from './screens/hint/FindStationViewContainer'
import HintScanQr from './screens/hint/ScanQrViewContainer'
import HintSaved from './screens/hint/SavedViewContainer'
import HintBringback from './screens/hint/BringbackViewContainer'
import HintRecommend from './screens/hint/RecommendViewContainer'

const SignupStack = (
  <Stack key={'signup'} >
    <Scene 
      key='signup_first'
      hideNavBar
      component={FirstScreen}
    />
    <Scene 
      key='signup_set_confirm_code'
      hideNavBar
      component={SetConfirmCode}
      
    />
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
  </Stack>
)

export default SignupStack
