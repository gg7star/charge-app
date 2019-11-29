import React from 'react'
import { View, Image, Text } from 'react-native'
import moduleStyles from '../../../common/styles'
import { Button } from '~/common/components'
import { em } from '~/common/constants'
import { Actions } from 'react-native-router-flux'

export default class PayBox extends React.Component {
  render() {
    const { _t } = this.props.appActions

    return (
      <View style={[moduleStyles.boxContainer, {
        backgroundColor: '#35cdfa'
      }]}>
        <Image source={require('~/common/assets/images/png/bg17.png')} style={{
          position: 'absolute', top: 0, right: 0
        }} />
        <Text style={{
          fontSize: 36, color: 'white', fontWeight: 'bold'
        }}>
          0,00€
        </Text>
        <Text style={{
          fontSize: 16, color: 'white', marginVertical: 10,
        }}>
          {_t('Current balance')}
        </Text>
        <View style={{
          flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.18)', paddingTop: 10
        }}>
          <Text style={{
            fontSize: 14, color: 'white', width: 200
          }}>
            {_t('Load my account for to have advantages')}
          </Text>
          <View style={{width: 100}}>
            <Button caption={_t('GO')}
              bgColor='white' textColor='#35cdfa' containerHeight={33*em} borderRadius={12*em}
              onPress={() => Actions['profile_pay']()}
            />
          </View>
        </View>
      </View>
    )
  }  
}
