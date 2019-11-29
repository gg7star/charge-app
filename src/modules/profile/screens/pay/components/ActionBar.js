import React from 'react'
import { View, TouchableOpacity, Text, Image } from 'react-native'
import { W } from '~/common/constants'
import { Button } from '~/common/components'
import { Actions } from 'react-native-router-flux'

export default class ActionBar extends React.Component {  
  render() {
    const { _t } = this.props.appActions

    return (
      <View style={{
        position: 'absolute', left: 10, bottom: 40, 
        backgroundColor: 'white', 
        width: W-20, zIndex: 10,
      }}>
        <View style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'center', 
          marginVertical: 5
        }}>
          <Text style={{color: '#9f9f9f', fontSize: 14, }}>
            {_t('Current method of payment')}:
          </Text>
          <TouchableOpacity style={{flexDirection: 'row', marginLeft: 5}}>
            <Text style={{
              color: '#35cdfa', fontSize: 14
            }}>
              CHANGER
            </Text>
            <Image source={require('~/common/assets/images/png/arrow2.png')} style={{
              tintColor: '#35cdfa', marginTop: 5, marginLeft: 8
            }} />
          </TouchableOpacity>
        </View>
        <Button caption='Pay'
          bgColor='#36384a' textColor='#fff' borderRadius={15}
          icon={require('~/common/assets/images/png/apple.png')} iconColor='#fff'
          onPress={this.onPay}
        />
        <TouchableOpacity>
          <Text style={{ fontSize: 13, color: '#36384a', width: '100%', textAlign: 'center', marginVertical: 5 }}>
            {_t('NO THANK YOU, I WISH TO PAY BY USE')}
          </Text>
        </TouchableOpacity>        
      </View>
    )
  }

  onPay = () => {
    Actions['profile_wallet']({whatDid: 'pay_success'})
  }
}
