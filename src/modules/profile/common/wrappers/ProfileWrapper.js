import React from 'react'
import { View, Platform } from 'react-native'
import { W, H, em } from '~/common/constants'

export default class ProfileWrapper extends React.Component {
  render() {
    return (
      <View 
        style={{
          paddingTop: (Platform.OS === 'ios') ? 40 : 10,
          paddingHorizontal: (Platform.OS === 'ios') ? 10 : 0,
          width: W,
          height: H,
          backgroundColor: 'white',
          position: 'relative',
          paddingLeft: 20,
          paddingRight: 20
        }
      }>
        {this.props.children}
      </View>
    )
  }
}
