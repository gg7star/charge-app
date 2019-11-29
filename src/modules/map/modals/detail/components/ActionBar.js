import React from 'react'
import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native'
import { Button } from '~/common/components'
import { em } from '~/common/constants'

export default class ActionBar extends React.Component {
  state = {
    searchVal: ''
  }

  render() {
    const { _t } = this.props.appActions
    const { data } = this.props

    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
      >
        <View style={{ width: 190*em }}>
          <Button 
            icon={require('~/common/assets/images/png/go.png')} iconColor='#fff'
            textColor='#fff'
            bgGradientStart='#ff52a8' bgGradientEnd='#ffdf00'
            caption={data.distance}
            onPress={() => this.props.onFinish()}
          />          
        </View>
        <View style={{ width: 130*em }}>
          <Button 
            bgColor='transparent' textColor='#ff52a8'
            caption={_t('Book')} onPress={() => this.props.onReserve()}
          />          
        </View>
        
      </View>
    )
  }
}
