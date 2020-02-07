import React from 'react'
import { TouchableOpacity, View, Text, Image } from 'react-native'
import { Actions } from 'react-native-router-flux'
import ProfileWrapper from '../../common/wrappers/ProfileWrapper'
import ProfileHeader from '../../common/headers/ProfileHeader'
import { W, H, em, colors } from '~/common/constants';
import { PhoneAuth, FacebookAuth } from '~/common/services/rn-firebase/auth';
import styles from './styles';

const CARD_IMAEG = require('~/common/assets/images/png/card-2x.png');
const RIGHT_ARROW_IMAGE = require('~/common/assets/images/png/arrow.png');

export default class ScreenView extends React.Component {
  state = {
  };

  goBack = () => {
    Actions.map();
    Actions['map_first']({profileOpened: true});
  };

  onBankInfo = () => {
    Actions['profile_payment']();
  };

  signout = async () => {
    const { authProvider } = this.props.auth;
    const res = await PhoneAuth.logoutWithPhone();
    if (authProvider === FacebookAuth.AUTH_PROVIDER) FacebookAuth.logoutWithFacebook();
    this.props.authActions.doLogout();
    Actions.login();
  }

  renderSettingTable() {
    const { credential } = this.props.auth
    const { _t } = this.props.appActions

    return (
      <View style={styles.container}>
        <View style={styles.itemContainer}>
          <Text style={styles.title}>{_t('Name')}</Text>
          <Text style={styles.text}>{credential.user.displayName}</Text>
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.title}>{_t('Telephone')}</Text>
          <Text style={styles.text}>{credential.user.phoneNumber}</Text>
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.title}>{_t('Email')}</Text>
          <Text style={styles.text}>{credential.user.email}</Text>
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.title}>{_t('Birth date')}</Text>
          <Text style={styles.text}>{credential.user.birthday}</Text>
        </View>
        <View style={styles.linkedItemContainer}>
          <TouchableOpacity style={styles.linkedItemTouchable} onPress={this.onBankInfo}>
            <View style={{flexDirection: 'row'}}>
              <Image source={CARD_IMAEG} style={styles.linkedAvatar} />
              <Text style={styles.linkedTitle}>{_t('Bank info')}</Text>
            </View >
            <Image source={RIGHT_ARROW_IMAGE} style={styles.linkedArrow} />
          </TouchableOpacity>
        </View>
        <View style={styles.linkedItemContainer}>
          <TouchableOpacity style={styles.linkedItemTouchable}>
            <Text style={styles.linkedTitle}>{_t('Terms of use')}</Text>
            <Image source={RIGHT_ARROW_IMAGE} style={styles.linkedArrow} />
          </TouchableOpacity>
        </View>
        <View style={styles.linkedItemContainer}>
          <TouchableOpacity style={styles.linkedItemTouchable}>
            <Text style={styles.linkedTitle}>{_t('Privacy of policy')}</Text>
            <Image source={RIGHT_ARROW_IMAGE} style={styles.linkedArrow} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderActionBar() {
    const { _t } = this.props.appActions

    return (
      <View style={{ 
        width: W, 
        position: 'absolute', left: 0, bottom: 40, zIndex: 30,
        alignItems: 'center'        
      }}>
        <TouchableOpacity onPress={this.signout}>
          <Text style={{ color: '#fe000c', fontSize: 17 }}>
            {_t('Sign Out')}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const { _t } = this.props.appActions

    return (
      <ProfileWrapper>
        <ProfileHeader title={_t('Settings')} onPress={this.goBack} />
        {this.renderSettingTable()}
        {this.renderActionBar()}
      </ProfileWrapper>
    )
  }
}
