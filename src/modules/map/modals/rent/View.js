import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay';
import RentDialogWrapper from '../../common/wrappers/RentDialogWrapper'
import { Spacer, Button } from '~/common/components'
import { colors, W, H, em } from '~/common/constants'

export default class Dialog extends React.Component {  
  state = {
    time: '00:02'
  }

  render() {
    const { stripe } = this.props
    return (
      <RentDialogWrapper>
        <Spinner
          visible={stripe.isFetching}
          textContent={'Doing payment...'}
          textStyle={{color: '#FFF'}}
        />
        {this.renderTitle()} 
        <Spacer size={20} />
        {this.renderActions()}
      </RentDialogWrapper>
    )
  }

  renderTitle() {
    const { _t } = this.props.appActions

    return (
      <View style={{
        alignItems: 'center'
      }}>
        <Text style={{
          color: '#fff', fontSize: 17,
          lineHeight: 42
        }}>
          {_t('Location duration')}
        </Text>
        <Text style={{
          color: '#fff', fontSize: 36, fontWeight: 'bold',
          lineHeight: 70
        }}>
          {this.state.time}
        </Text>
      </View>
    )
  }

  renderPriceTable() {
    const { _t } = this.props.appActions

    return (
      <View style={{
        borderColor: 'rgba(255, 255, 255, 0.2)', 
        borderTopWidth: 1, borderBottomWidth: 1,
        paddingVertical: 10
      }}>
        <View style={{
          flexDirection: 'row', justifyContent: 'space-between', 
          paddingVertical: 10
        }}>
          <View style={{ width: 170*em}}>
            <Text style={{
              color: 'white', fontSize: 17
            }}>
              {_t('Rental Price')}
            </Text>
          </View>
          <View style={{ width: 150*em}}>
            <Text style={{
              color: 'white', fontSize: 17, marginLeft: 20
            }}>
              0,50 €/ 30mn
            </Text>
            <Text style={{
              color: 'rgba(255, 255, 255, 0.7)', fontSize: 11
            }}>
              {`${_t('Maximum rate per day')} 3€`}
            </Text>
          </View>
        </View>
        <View style={{
          flexDirection: 'row', justifyContent: 'space-between', 
          paddingVertical: 10
        }}>
          <View style={{ width: 170*em}}>
            <Text style={{
              color: 'white', fontSize: 17
            }}>
              {_t('Free credits')}
            </Text>
          </View>
          <View style={{ width: 150*em}}>
            <Text style={{
              color: 'white', fontSize: 17, marginLeft: 20
            }}>
              0,50 €
            </Text>
          </View>
        </View>
      </View>
    )
  }

  renderActions() {
    const { _t } = this.props.appActions

    return (
      <View>
        <View style={{
          flexDirection: 'row', justifyContent: 'space-between'
        }}>
          <View style={{ width: 150*em}}>
            <Button 
              textColor='white' bgColor='transparent' borderRadius={15}
              caption={_t('Buy')}
              onPress={this.props.onBuy}
            />
          </View>        
          <View style={{ width: 150*em}}>
            <Button 
              textColor='#ff52ab' bgColor='white' borderRadius={15}
              caption={_t('Deposit')}
              icon={require('~/common/assets/images/png/arrow-direction.png')}
              iconColor='#ff52a8' iconAlign='right'
              onPress={this.props.onDeposit}
            />
          </View>
        </View>
      </View>
    )
  }
}
