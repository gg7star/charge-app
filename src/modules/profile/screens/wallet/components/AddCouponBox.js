import React from 'react'
import { View, Image, Text } from 'react-native'
import moduleStyles from '../../../common/styles'
import { Button } from '~/common/components'
import { em } from '~/common/constants'
import { Actions } from 'react-native-router-flux'

export default class CouponBox extends React.Component {
  render() {
    const { _t } = this.props.appActions

    return (
      <View style={[moduleStyles.boxContainer, {
        backgroundColor: '#fff',
        borderWidth: 1, borderColor: '#07e2be'
      }]}>
        <Image source={require('~/common/assets/images/png/flash.png')} style={{
          position: 'absolute', top: 0, right: 0,
          tintColor: 'rgba(7, 226, 190, 0.48)'
        }} />
        <View style={{
          flexDirection: 'row', justifyContent: 'space-between'
        }}>
          <View>
            <Text style={{
              fontSize: 26, color: '#07e2be', fontWeight: 'bold'
            }}>
              {_t('CODE PROMO')}
            </Text>
            <Text style={{
              fontSize: 16, color: '#9f9f9f', marginVertical: 5,
            }}>
              {_t('Add a promo code')}
            </Text>
          </View>
          <View style={{width: 100, paddingTop: 20}}>
            <Button caption={_t('Add')}
              bgColor='#07e28e' textColor='#fff'
              containerHeight={33*em} borderRadius={12*em}
              onPress={this.goAddCoupon}
            />
          </View>
        </View>
      </View>
    )
  }

  goAddCoupon = () => {
    Actions['profile_add_coupon']()
  }
}
