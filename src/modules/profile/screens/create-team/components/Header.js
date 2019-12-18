import React from 'react'
import { View, TouchableOpacity, Image } from 'react-native'
import { Actions } from 'react-native-router-flux'

export default class Header extends React.Component {
  render() {
    return (
      <TouchableOpacity
        style={{width: 50, height: 50, marginTop: 20, alignItems: 'center', justifyContent: 'center'}}
        onPress={this.goBack}
      >
        <Image source={require('~/common/assets/images/png/arrow-blue.png')} 
          style={{width: 10, height: 16}}
        />
      </TouchableOpacity>
    )
  }

  goBack = () => {
    Actions.map();
    Actions['map_first']({profileOpened: true});
  }
}
