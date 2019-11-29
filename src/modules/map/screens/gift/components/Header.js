import React from 'react'
import { View, TouchableOpacity, Image } from 'react-native'
import { Actions } from 'react-native-router-flux'

export default class Header extends React.Component {
  render() {
    return (
      <View style={{
        
      }}>
        <TouchableOpacity onPress={this.goBack}>
          <Image source={require('~/common/assets/images/png/arrow-blue.png')} 
            style={{
              width: 10, height: 16
            }}
          />
        </TouchableOpacity>
      </View>
    )
  }

  goBack = () => {
    Actions['map_first']()
  }
}
