import React from 'react'
import { View, Image, Text } from 'react-native'
import moduleStyles from '../../../common/styles'
import { Button } from '~/common/components'
import { em } from '~/common/constants'

export default class CouponBox extends React.Component {
  render() {
    const { _t } = this.props.appActions

    return (
      <View style={[moduleStyles.boxContainer, {
        backgroundColor: '#07e28e',
      }]}>
        <Image source={require('~/common/assets/images/png/flash.png')} style={{
          position: 'absolute', top: 0, right: 0,
          tintColor: 'rgba(255, 255, 255, 0.68)'
        }} />
        <View style={{
          flexDirection: 'row', justifyContent: 'space-between'
        }}>
          <View>
            <Text style={{
              fontSize: 26, color: '#fff', fontWeight: 'bold'
            }}>
              {_t('CODE PROMO')}
            </Text>
            <Text style={{
              fontSize: 16, color: '#fff', marginVertical: 5,
            }}>
              {_t('Promo code actived')}
            </Text>
          </View>
          <View style={{width: 100, paddingTop: 20}}>
            <Button caption={_t('View')}
              bgColor='rgba(255, 255, 255, 0.5)' textColor='#fff'
              containerHeight={33*em} borderRadius={12*em}
            />
          </View>
        </View>
      </View>
    )
  }  
}
