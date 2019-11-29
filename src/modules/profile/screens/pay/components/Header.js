import React from 'react'
import { View, Text, Image } from 'react-native'

export default class Header extends React.Component {
  render() {
    const { _t } = this.props.appActions

    return (
      <View style={{
        paddingTop: 40, paddingHorizontal: 10, height: 120,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'
      }}>
        <View style={{ flex: 1, alignItems: 'flex-start' }}>
          <Image source={require('~/common/assets/images/png/arrow.png')}
            style={{tintColor: '#fff'}}
          />
        </View>
        <View style={{ flex: 8, alignItems: 'center'}}>
          <Text style={{fontSize: 34, color: 'white', fontWeight: 'bold'}}>
            0,00€
          </Text>
          <Text style={{fontSize: 16, color: 'white'}}>
            {_t('Current balance')}
          </Text>
        </View>
        <View style={{ flex: 1}}>

        </View>
      </View>
    )
  }
}
