import React from 'react'
import { View, ScrollView, Image, Text } from 'react-native'
import { W, H, em } from '~/common/constants'
import Header from './components/Header'
import { Spacer } from '~/common/components'
import TouchableScale from 'react-native-touchable-scale'
import LinearGradient from 'react-native-linear-gradient'

export default class ScreenView extends React.Component {
  render() {
    const { _t } = this.props.appActions
    return (
      <Wrapper>
        <Header />
        <ScrollView>
          <Spacer size={60} />
          <View style={{
            alignItems: 'center'
          }}>
            <Image source={require('~/common/assets/images/png/code-parrainage.png')} />
          </View>
          <Spacer size={20} />
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 26, fontWeight: 'bold' }}>
              {_t('Referral Code')}
            </Text>
            <Text style={{ fontSize: 17 }}>
              {_t('Charge your phone for free')}
            </Text>
          </View>
          <Spacer size={20} />
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 15, textAlign: 'center', width: 300 }}>
              {_t('Invite a friend to use nono and win 24h free charge after first use')} 
            </Text>
          </View>
          <Spacer size={20} />
          <View style={{ alignItems: 'center' }}>
            <Text style={{  fontSize: 15  }}>
              {_t('Your battery goes down!')}

            </Text>
            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
              {_t('Share your code quickly')}
            </Text> 
          </View>
          <Spacer size={40} />
          <View style={{ alignCenter: 'center' }}>
            <Text style={{ textAlign: 'center' }}>
              {_t('Share your code')}
            </Text>
            <Spacer size={5} />
            <TouchableScale style={{
              
            }}>
              <LinearGradient colors={['#07e28e', '#36f7ad']}
                style={{
                  paddingLeft: 8, paddingRight: 20,
                  borderRadius: 20,
                  alignItems: 'center',
                  position: 'relative'
                }}
              >
                <Text style={{
                  fontSize: 16, lineHeight: 50, color: 'white'
                }}>
                  {'THEO1827nono'}
                </Text>
                <Image source={require('~/common/assets/images/png/code-share.png')}
                  style={{ position: 'absolute', right: 20, top: 15, tintColor: 'white' }}
                />
              </LinearGradient>
            </TouchableScale>
          </View>
        </ScrollView>
      </Wrapper>
    )
  }
}

const Wrapper = (props) => (
  <View style={{
    position: 'relative', width: W, height: H, paddingTop: 60
  }}>
    <Image source={require('~/common/assets/images/png/14.S1-nono.map.png')}
      style={{
        position: 'absolute', left: 0, top: 0, width: W,
        zIndex: 10
      }}
    />
    <View style={{
      position: 'absolute', left: 0, top: 0, width: W,
      zIndex: 20, paddingTop: 60, paddingHorizontal: 20
    }}>
      {props.children}
    </View>
  </View>
)
