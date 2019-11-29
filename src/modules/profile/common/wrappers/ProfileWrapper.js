import React from 'react'
import { View } from 'react-native'
import { W, H, em } from '~/common/constants'

export default class ProfileWrapper extends React.Component {
  render() {
    return (
      <View 
        style={{
          paddingTop: 60, paddingHorizontal: 10,
          width: W, height: H,
          backgroundColor: 'white',
          position: 'relative'
        }
      }>
        {this.props.children}
      </View>
    )
  }
}
