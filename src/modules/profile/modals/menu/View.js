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
            <Text style={{ 
              fontSize: 23, color: colors.primary, fontWeight: '600',
              marginVertical: 10, 
            }}>
              {accountInfo && accountInfo.name}
            </Text>
            <View>
              <View style={{}}>
                <TouchableScale>
                  <LinearGradient colors={['#07e28e', '#36f7ad']} style={{
                    paddingVertical: 10, paddingLeft: 8,
                    borderRadius: 15, 
                    flexDirection: 'row', width: '100%',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <View style={{ flexDirection: 'row' }}>
                      <MaterialIcon name='flash-on' style={{
                        backgroundColor: 'transparent',
                        color: 'white', fontSize: 24,             
                      }} />                    
                      <Text style={{
                        color: 'white', fontSize: 16, fontWeight: '600',
                      }}>
                        {_t('Charge Free')}
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
                    onPress={() => {
                      Actions.profile()
                      Actions[menu.route]()
                    }}
                  />
                  :
                  <MenuItem
                    image={menu.image}
                    title={_t(menu.title)}
                    onPress={() => {
                      Actions.profile()
                      Actions[menu.route]()
                    }}
                  />
                  }
                </View>
              ))}
            </View>
            <View style={{ 
              position: 'absolute', bottom: 40, left: 20,            
            }}>
              <MenuItem 
                image={lastMenuItem.image} 
                title={_t(lastMenuItem.title)}
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
    title: 'Wallet',
    image: require('~/common/assets/images/menu-wallet.png'),
    route: 'profile_wallet'
  },
  {
    title: 'Historical',
    image: require('~/common/assets/images/menu-history.png'),
    route: 'profile_history'
  },
  {
    title: 'Payment',
    image: require('~/common/assets/images/menu-payment.png'),
    route: 'profile_payment'
  },
  {
    title: 'Settings',
    image: require('~/common/assets/images/menu-settings.png'),
    route: 'profile_setting'
  },
  {
    title: 'About us',
    image: require('~/common/assets/images/menu-aboutus.png'),
    route: 'profile_about_us'
  }
]

const lastMenuItem = {
  title: 'Need help?',
  image: require('~/common/assets/images/png/help.png'),
  route: 'profile_help'
}
