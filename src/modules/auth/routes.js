import React from 'react'
import { Scene, Stack } from 'react-native-router-flux'
import Login from './screens/login/ViewContainer'

const AuthStack = (
  <Stack key={'auth'}>
    <Scene 
      key='login'
      hideNavBar
      component={Login}
    />
  </Stack>
)

export default AuthStack
