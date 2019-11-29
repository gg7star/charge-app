import React from 'react'
import { Scene, Stack, Actions } from 'react-native-router-flux'
import Wallet from './screens/wallet/ViewContainer'
import History from './screens/history/ViewContainer'
import HistorySummary from './screens/history-summary/ViewContainer'
import Payment from './screens/payment/ViewContainer'
import Setting from './screens/setting/ViewContainer'
import AboutUs from './screens/about-us/ViewContainer'
import Help from './screens/help/ViewContainer'
import AddCoupon from './screens/add-coupon/ViewContainer'
import Pay from './screens/pay/ViewContainer'


const ProfileStack = (
  <Stack key={'profile'}>
    <Scene 
      key='profile_wallet'
      hideNavBar
      component={Wallet}
      
    />
    <Scene
      key='profile_add_coupon'
      hideNavBar
      component={AddCoupon}
    />
    <Scene 
      key='profile_pay'
      hideNavBar
      component={Pay}
      
    />
    <Scene 
      key='profile_history'
      hideNavBar
      component={History}
      
    />
    <Scene 
      key='profile_history_summary'
      hideNavBar
      component={HistorySummary}
      
    />
    <Scene 
      key='profile_payment'
      hideNavBar
      component={Payment}
      
    />
    <Scene 
      key='profile_setting'
      hideNavBar
      component={Setting}
      
    />
    <Scene 
      key='profile_about_us'
      hideNavBar
      component={AboutUs}
      
    />
    <Scene 
      key='profile_help'
      hideNavBar
      component={Help}
      
    />
  </Stack>
)

export default ProfileStack
