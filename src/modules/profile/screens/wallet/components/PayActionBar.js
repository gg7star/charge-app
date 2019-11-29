import React from 'react'
import { View, TouchableOpacity, Text, Image } from 'react-native'
import { W } from '~/common/constants'
import { Button } from '~/common/components'

export default class PayActionBar extends React.Component {
  render() {
    const { _t } = this.props.appActions

    return (
      <View style={{
        position: 'absolute', left: 10, bottom: 40,
        width: W-20,        
      }}>
        <View style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 5
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
        />
      </View>
    )
  }  
}
