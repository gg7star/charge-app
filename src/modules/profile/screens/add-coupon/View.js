import React from 'react';
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import { W, H, em } from '~/common/constants';
import { Button } from '~/common/components';
import ProfileWrapper from '../../common/wrappers/ProfileWrapper'
import ProfileHeader from '../../common/headers/ProfileHeader'
import { Actions } from 'react-native-router-flux';

export default class ScreenView extends React.Component {
  state = {
    adjust: {
      bottomPos: 60
    }
  }

  render = () => {
    const { _t } = this.props.appActions;

    return (
      <ProfileWrapper>
        <ProfileHeader title={_t('Add a promo code')} onPress={this.goWallet} />
        <View>
          <TextInput placeholder='CODE PROMO' style={{
            fontSize: 26, color: 'white', borderColor: '#35cdfa', borderWidth: 1,
            backgroundColor: '#07e28e', padding: 20,
            borderRadius: 20
          }} onFocus={this.adjustOnTextFocus} onBlur={this.adjustOnTextBlur} 
            placeholderTextColor='#rgba(255, 255, 255, 0.39)'
          />
        </View>
        <View style={{
          position: 'absolute',
          left: 10, bottom: this.state.adjust.bottomPos, width: W-20
        }}>
          <Button caption={_t('Validate')}
            bgColor='rgba(7, 226, 142, 0.5)' textColor='white'
            onPress={this.addCoupon}
          />
        </View>
      </ProfileWrapper>
    )
  }

  goWallet = () => {
    Actions['profile_wallet']()
  }

  addCoupon = () => {
    this.props.profileActions.addCoupon()
  }

  adjustOnTextFocus = () => {
    this.setState({...this.state, adjust: {bottomPos: 340}})
  }

  adjustOnTextBlur = () => {
    this.setState({...this.state, adjust: {bottomPos: 60}})
  }

}