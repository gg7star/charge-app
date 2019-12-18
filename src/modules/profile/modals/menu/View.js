import React from 'react';
import { View, Text, Image } from 'react-native';
import TouchableScale from 'react-native-touchable-scale';
import { Actions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
// import Intl from 'react-native-intl'
import { colors } from '~/common/constants';
import BackWrapper from './wrappers/BackWrapper';
import MenuWrapper from './wrappers/MenuWrapper';
import MenuItem from './components/MenuItem';

const TREE_IMAGE = require('~/common/assets/images/png/tree.png');
const NOTIFICATION_IMAGE = require('~/common/assets/images/menu-notification.png');
const MEDAL_IMAGE = require('~/common/assets/images/menu-medal.png');
const PLANT_IMAGE = require('~/common/assets/images/menu-plant.png');
const HISTORY_IMAGE = require('~/common/assets/images/menu-history.png');
const SETTINGS_IMAEG = require('~/common/assets/images/menu-settings.png');
const ABOUT_US_IMAGE = require('~/common/assets/images/menu-aboutus.png');
const NEED_HELP_IMAGE = require('~/common/assets/images/menu-help.png');

export default class Menu extends React.Component {
  handleClickOutside = () => {
    Actions.map();
    Actions['map_first']({profileOpened: false});
  }

  render() {
    const { isShowable } = this.props
    const { _t } = this.props.appActions
    const { accountInfo } = this.props.auth

    return (
      <React.Fragment>
        { isShowable && 
        <BackWrapper onPress={this.handleClickOutside}>
          <MenuWrapper onClose={this.props.onClose}>
            <Text
              style={{ 
                fontSize: 23,
                color: colors.primary,
                fontWeight: '600',
                marginVertical: 10,
                marginLeft: 5
              }}
            >
              {accountInfo && accountInfo.name}
            </Text>
            <View>
              <View style={{}}>
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
              {menuList.map((menu, k) => (
                <View key={k}>
                  <MenuItem
                    image={menu.image}
                    title={_t(menu.title)}
                    disabled={menu.disabled}
                    onPress={() => {
                      Actions.profile();
                      Actions[menu.route]();
                    }}
                  />
                </View>
              ))}
            </View>
            <View style={{position: 'absolute', bottom: 40, left: 20}}>
              <MenuItem 
                image={lastMenuItem.image} 
                title={_t(lastMenuItem.title)}
                disabled={lastMenuItem.disabled}
                onPress={() => {
                  Actions.profile();
                  Actions[lastMenuItem.route]();
                }}
              />
            </View>
          </MenuWrapper>
        </BackWrapper>
        }
      </React.Fragment>
    )
  }
}

const menuList = [
  {
    title: 'Notifications',
    image: NOTIFICATION_IMAGE,
    route: 'profile_history',
    disabled: false
  },
  {
    title: 'My points',
    image: MEDAL_IMAGE,
    route: 'profile_history',
    disabled: true
  },
  {
    title: 'Your planted trees',
    image: PLANT_IMAGE,
    route: 'profile_history',
    disabled: true
  },
  {
    title: 'Histories',
    image: HISTORY_IMAGE,
    route: 'profile_history',
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
