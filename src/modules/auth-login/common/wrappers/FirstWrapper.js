import React from 'react'
import { View, ImageBackground, ScrollView } from 'react-native'
import { W, H, em } from '~/common/constants'
import { KeyboardAvoidingView } from '~/common/components'

const FirstWrapper = ({ children }) => (
  <ScrollView style={{
    flex: 1, position: 'relative', height: H
  }}>
    <ImageBackground
      source={require('~/common/assets/images/png/login-bg.jpg')}
      style={{
        flex: 1, height: H
      }}
      resizeMode='cover'
    >
      {children}
    </ImageBackground>
  </ScrollView>
)

export default FirstWrapper
