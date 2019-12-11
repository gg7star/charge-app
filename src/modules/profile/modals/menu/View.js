import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { W, H, em, colors } from '~/common/constants'
import TouchableScale from 'react-native-touchable-scale'
import { List, ListItem } from 'native-base'
import LinearGradient from 'react-native-linear-gradient'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
// import Intl from 'react-native-intl'
import BackWrapper from './wrappers/BackWrapper'
import MenuWrapper from './wrappers/MenuWrapper'
import MenuItem from './components/MenuItem'
import { Actions } from 'react-native-router-flux'

export default class Menu extends React.Component {
  render() {
    const { isShowable } = this.props
    const { _t } = this.props.appActions
    const { accountInfo } = this.props.auth

    let currency_ = 0
    // const formatter = new Intl.NumberFormat('fr-fr', {
    //   style: 'currency',
    //   currency: 'EUR',
    //   minimumFractionDigits: 2
    // })

    if (this.props.profile) {      
      currency = this.props.profile.cash.money //formatter.format(this.props.profile.cash.money)
    } else {
      currency = 0 //formatter.format(0)
    }

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
              }}
            >
              {accountInfo && accountInfo.name}
            </Text>
            <View>
              <View style={{}}>
                <TouchableScale
                  onPress={() => {
                    Actions.profile()
                    Actions['profile_create_team']()
                  }}
                >
                  <LinearGradient
                    colors={['#07e28e', '#36f7ad']}
                    style={{
                      paddingVertical: 10, paddingLeft: 8,
                      borderRadius: 15, 
                      flexDirection: 'row', width: '100%',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <View style={{ flexDirection: 'row' }}>
                      <Image
                        source={require('~/common/assets/images/png/tree.png')} 
                        style={{width: 20, height: 20, marginLeft: 5, marginRight: 5}}
                      />
                      <Text
                        style={{
                          color: 'white', fontSize: 16, fontWeight: '600', paddingLeft: 5
                        }}
                      >
                        {_t('Start your forest')}
                      </Text>
                    </View>                    
                    <MaterialIcon name='chevron-right' style={{
                      backgroundColor: 'transparent',
                      color: 'white', fontSize: 24,
                    }} />
                  </LinearGradient>
                </TouchableScale>
              </View>
              {menuList.map((menu, k) => (
                <View key={k}>
                  { menu.title=='Wallet'?
                  <MenuItem
                    image={menu.image}
                    title={_t(menu.title)}
                    subtitle={currency}
                    disabled={menu.disabled}
                    onPress={() => {
                      Actions.profile()
                      Actions[menu.route]()
                    }}
                  />
                  :
                  <MenuItem
                    image={menu.image}
                    title={_t(menu.title)}
                    disabled={menu.disabled}
                    onPress={() => {
                      Actions.profile()
                      Actions[menu.route]()
                    }}
                  />
                  }
                </View>
              ))}
            </View>
            <View style={{position: 'absolute', bottom: 40, left: 20}}>
              <MenuItem 
                image={lastMenuItem.image} 
                title={_t(lastMenuItem.title)}
                disabled={lastMenuItem.disabled}
                onPress={() => {
                  Actions.profile()
                  Actions[lastMenuItem.route]()
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
    image: require('~/common/assets/images/menu-notification.png'),
    route: 'profile_history',
    disabled: false
  },
  {
    title: 'My points',
    image: require('~/common/assets/images/menu-medal.png'),
    route: 'profile_history',
    disabled: true
  },
  {
    title: 'Your planted trees',
    image: require('~/common/assets/images/menu-plant.png'),
    route: 'profile_history',
    disabled: true
  },
  // {
  //   title: 'Wallet',
  //   image: require('~/common/assets/images/menu-wallet.png'),
  //   route: 'profile_wallet'
  // },
  {
    title: 'Histories',
    image: require('~/common/assets/images/menu-history.png'),
    route: 'profile_history',
    disabled: false
  },
  // {
  //   title: 'Payment',
  //   image: require('~/common/assets/images/menu-payment.png'),
  //   route: 'profile_payment'
  // },
  {
    title: 'Settings',
    image: require('~/common/assets/images/menu-settings.png'),
    route: 'profile_setting',
    disabled: false
  },
  {
    title: 'About us',
    image: require('~/common/assets/images/menu-aboutus.png'),
    route: 'profile_about_us',
    disabled: false
  }
]

const lastMenuItem = {
  title: 'Need help?',
  image: require('~/common/assets/images/png/help.png'),
  route: 'profile_help',
  disabled: false
}
