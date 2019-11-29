import React from 'react'
import { TouchableOpacity, View, Text, Image } from 'react-native'
import { Actions } from 'react-native-router-flux'
import ProfileWrapper from '../../common/wrappers/ProfileWrapper'
import ProfileHeader from '../../common/headers/ProfileHeader'
import { W, H, em } from '~/common/constants';
import { Button, Spacer } from '~/common/components'

export default class ScreenView extends React.Component {
  state = {
  }

  render() {
    const { _t } = this.props.appActions;

    return (
      <ProfileWrapper>
        <ProfileHeader title={_t('Payment')} onPress={this.goBack} />
        {this.renderList()}
        {this.renderActionBar()}
      </ProfileWrapper>
    )
  }

  renderList() {
    const { _t } = this.props.appActions;

    return (
      <View>
        <View style={{marginVertical: 10}}>
          <TouchableOpacity>
            <Text style={{ fontSize: 15, color: '#35cdfa'}}>
              {_t('Current method of payment')}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', marginVertical: 10 }}>
          <View style={{flex: 1, marginRight: 10}}>
            <Image source={require('~/common/assets/images/png/Lydia-add.png')} />
          </View>          
          <View style={{flex: 7}}>
            <Text>Lydia</Text>
            <Text style={{ color: '#9f9f9f'}}>theorouilly@nono.fr</Text>
          </View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Image source={require('~/common/assets/images/png/remove.png' )} />
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{flex: 1, marginRight: 10, alignItems: 'center'}}>
            <Image source={require('~/common/assets/images/png/add-card.png' )} 
            />
          </View>
          <View style={{flex: 7, }}>
            <Text style={{ fontSize: 16 }}>
              {_t('Add a credit card')}
            </Text>
          </View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Image source={require('~/common/assets/images/png/arrow.png')} 
              style={{width: 15, height: 15, tintColor: '#dfdfe6', transform:[{rotate: '180deg'}]}}
            />
          </View>
        </View>
      </View>
    )
  }

  renderActionBar() {
    const { _t } = this.props.appActions

    return (
      <View style={{
        position: 'absolute', left: 10, bottom: 40,
        width: W-20,        
      }}>
        <Button caption={_t('Add a Lydia account')}
          bgColor='#00a0f1' textColor='#fff' borderRadius={15}
          icon={require('~/common/assets/images/png/lydia.png')} iconColor='#fff'
          containerHeight={40}
        />
        <Spacer size={10} />
        <Button caption={_t('Add Apple Pay')}
          bgColor='#36384a' textColor='#fff' borderRadius={15}
          icon={require('~/common/assets/images/png/apple.png')} iconColor='#fff'
          containerHeight={40}
        />
      </View>
    )
  }

  goBack = () => {
    Actions.map()
    Actions['map_first']()
  }
}
