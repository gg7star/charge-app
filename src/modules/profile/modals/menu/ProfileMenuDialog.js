import React from 'react';
import Modal from "react-native-modal";
import { View, Text, Image } from 'react-native';
import TouchableScale from 'react-native-touchable-scale';
import { Actions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import BackWrapper from '~/modules/profile/modals/menu/wrappers/BackWrapper';
import MenuWrapper from '~/modules/profile/modals/menu/wrappers/MenuWrapper';
import MenuItem from '~/modules/profile/modals/menu/components/MenuItem';
import { H, W } from '~/common/constants';
import styles from './styles';

const TREE_IMAGE = require('~/common/assets/images/png/tree.png');
const NOTIFICATION_IMAGE = require('~/common/assets/images/menu-notification.png');
const MEDAL_IMAGE = require('~/common/assets/images/menu-medal.png');
const PLANT_IMAGE = require('~/common/assets/images/menu-plant.png');
const HISTORY_IMAGE = require('~/common/assets/images/menu-history.png');
const SETTINGS_IMAEG = require('~/common/assets/images/menu-settings.png');
const ABOUT_US_IMAGE = require('~/common/assets/images/menu-aboutus.png');
const NEED_HELP_IMAGE = require('~/common/assets/images/menu-help.png');
const CARD_IMAEG = require('~/common/assets/images/menu-payment_h20.png');
const RIGHT_ARROW_IMAGE = require('~/common/assets/images/png/arrow.png');
const LOGO_IMAGE = require('~/common/assets/images/png/logo.png');
const NONO_IMAGE = require('~/common/assets/images/png/Union-32.png');

export default class ProfileMenuDialog extends React.Component {
  state = {
    
  };

  handleClickOutside = () => {
    const { onClose } = this.props;
    onClose && onClose();
  }

  onClickItem = (route) => {
    const { onClose } = this.props;
    onClose && onClose();
    Actions.profile();
    Actions[route]();
  }

  renderStartYourForest = () => {
    return (
      <View>
        <TouchableScale
          onPress={() => {
            Actions.profile();
            Actions['profile_create_team']();
          }}
        >
          <LinearGradient
            colors={['#07e28e', '#36f7ad']}
            style={{
              paddingVertical: 10,
              paddingLeft: 8,
              borderRadius: 15, 
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Image
                source={TREE_IMAGE} 
                style={{ marginLeft: 5, marginRight: 5}}
              />
              <Text
                style={{
                  color: 'white', fontSize: 16, fontWeight: '600', paddingLeft: 5,
                  justifyContent: 'center', alignContent: 'center', alignItems: 'center'
                }}
              >
                {_t('Start your forest')}
              </Text>
            </View>                    
            <MaterialIcon
              name='chevron-right'
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                fontSize: 24,
              }}
            />
          </LinearGradient>
        </TouchableScale>
      </View>
    );
  };

  renderView = () => {
    const { _t } = this.props.appActions
    const { credential } = this.props.auth
    return (
      <View style={styles.container}>
        <View>
          <View style={styles.titleImageContainer}>
            <Image source={LOGO_IMAGE} style={styles.logoImage} />
          </View>
          <View style={styles.titleImageContainer}>
            <Image
              source={NONO_IMAGE}
              style={styles.titleImage}
            />
          </View>
        </View>
        <Text style={styles.displayName}>
          {credential && credential.user.displayName}
        </Text>
        <View>
          {/* {this.renderStartYourForest()} */}
          {menuList.map((menu, k) => (
            <View key={k}>
              <MenuItem
                image={menu.image}
                title={_t(menu.title)}
                disabled={menu.disabled}
                onPress={() => this.onClickItem(menu.route)}
              />
            </View>
          ))}
        </View>
        <View style={{position: 'absolute', bottom: 40, left: 20}}>
          <MenuItem 
            image={lastMenuItem.image} 
            title={_t(lastMenuItem.title)}
            disabled={lastMenuItem.disabled}
            onPress={() => this.onClickItem(lastMenuItem.route)}
          />
        </View>
      </View>
    );
  }

  render() {
    const { isVisible, onClose } = this.props;

    return (
      <Modal
        isVisible={isVisible}
        animationIn={'slideInLeft'}
        animationOut={'slideOutLeft'}
        hasBackdrop
        backdropOpacity={0.5}
        coverScreen
        style={{margin: 0}}
        onBackdropPress={() => onClose()}
      >
        { this.renderView() }
      </Modal>
    )
  }
}


const menuList = [
  {
    title: 'Notifications',
    image: NOTIFICATION_IMAGE,
    route: 'profile_notification',
    disabled: false
  },
  // {
  //   title: 'My points',
  //   image: MEDAL_IMAGE,
  //   route: 'profile_history',
  //   disabled: true
  // },
  // {
  //   title: 'Your planted trees',
  //   image: PLANT_IMAGE,
  //   route: 'profile_history',
  //   disabled: true
  // },
  {
    title: 'Histories',
    image: HISTORY_IMAGE,
    route: 'profile_history',
    disabled: false
  },
  {
    title: 'Bank info',
    image: CARD_IMAEG,
    route: 'profile_payment',
    disabled: false
  },
  {
    title: 'Settings',
    image: SETTINGS_IMAEG,
    route: 'profile_setting',
    disabled: false
  },
  {
    title: 'About us',
    image: ABOUT_US_IMAGE,
    route: 'profile_about_us',
    disabled: false
  }
]

const lastMenuItem = {
  title: 'Need help?',
  image: NEED_HELP_IMAGE,
  route: 'profile_help',
  disabled: false
}

