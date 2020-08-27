import React from 'react';
import Modal from "react-native-modal";
import { View, Text, Image } from 'react-native';
import MenuItem from '~/modules/profile/modals/menu/components/MenuItem';
import Notification from '~/modules/profile/screens/notification/ViewContainer';
import History from '~/modules/profile/screens/history/ViewContainer';
import Payment from '~/modules/profile/screens/payment/ViewContainer';
import Setting from '~/modules/profile/screens/setting/ViewContainer';
import AboutUs from '~/modules/profile/screens/about-us/ViewContainer';
import Help from '~/modules/profile/screens/help/ViewContainer';
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
    selectedMenu: null
  };

  handleClickOutside = () => {
    const { onClose } = this.props;
    onClose && onClose();
  }

  onClickItem = (menu) => {
    const { onClose } = this.props;
    this.setState({ selectedMenu: menu });
  }

  onCloseItem = () => {
    this.setState({selectedMenu: null});
  }

  renderView = () => {
    const { _t } = this.props.appActions;
    const { credential } = this.props.auth;
    const { selectedMenu } = this.state;
    const isModalVisible = selectedMenu ? true : false;
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
          {menuList.map((menu, k) => (
            <View key={k}>
              <MenuItem
                image={menu.image}
                title={_t(menu.title)}
                disabled={menu.disabled}
                onPress={() => this.onClickItem(menu)}
              />
            </View>
          ))}
        </View>
        {/* <View style={{position: 'absolute', bottom: 40, left: 20}}>
          <MenuItem 
            image={lastMenuItem.image} 
            title={_t(lastMenuItem.title)}
            disabled={lastMenuItem.disabled}
            onPress={() => this.onClickItem(lastMenuItem.route)}
          />
        </View> */}
        <Modal
          isVisible={isModalVisible}
          animationIn={'slideInRight'}
          animationOut={'slideOutLeft'}
          deviceWidth={W}
          deviceHeight={H}
          avoidKeyboard={true}
          // hasBackdrop
          backdropColor='white'
          coverScreen
          style={{ margin: 0 }}
        >
          {selectedMenu && <selectedMenu.component onClose={this.onCloseItem} />}
        </Modal>
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
        // hasBackdrop
        backdropOpacity={0.5}
        // coverScreen
        style={{ flex: 1, }}
        onBackdropPress={this.handleClickOutside}
      >
        {this.renderView()}
      </Modal>
    )
  }
}


const menuList = [
  {
    title: 'Notifications',
    image: NOTIFICATION_IMAGE,
    route: 'profile_notification',
    disabled: false,
    component: Notification
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
    disabled: false,
    component: History
  },
  {
    title: 'Bank info',
    image: CARD_IMAEG,
    route: 'profile_payment',
    disabled: false,
    component: Payment
  },
  {
    title: 'Settings',
    image: SETTINGS_IMAEG,
    route: 'profile_setting',
    disabled: false,
    component: Setting
  },
  {
    title: 'About us',
    image: ABOUT_US_IMAGE,
    route: 'profile_about_us',
    disabled: false,
    component: AboutUs
  }
]

const lastMenuItem = {
  title: 'Need help?',
  image: NEED_HELP_IMAGE,
  route: 'profile_help',
  disabled: false,
  component: Help
}

