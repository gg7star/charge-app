import React from 'react'
import { W, H, em, colors } from '~/common/constants'
import { View } from 'react-native'

const BackWrapper = (props) => {
  return (
    <View 
      style={{
        position: 'absolute', zIndex: 80, 
        left: 0, top: 0, width: W, height: H,
        backgroundColor: 'rgba(0, 0, 0, 0.44)'
      }}
    >
      {props.children}
    </View>
  )
}

export default BackWrapper
