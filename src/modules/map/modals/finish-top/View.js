import React from 'react'
import { View, Text, Image } from 'react-native'
import { Button, Spacer } from '~/common/components'
import { colors, W, H, em } from '~/common/constants'

export default class Dialog extends React.Component {
  render() {
    const { _t } = this.props.appActions
    const { place } = this.props.map

    return (
      <View style={{
        position: 'absolute', left: 0, top: 0, 
        width: W, zIndex: 30
      }}>
        <View style={{
          backgroundColor: '#35cdfa',
          paddingTop: 30, paddingBottom: 20, flexDirection: 'row'
        }}>
          <View style={{ marginTop: 20, marginLeft: 20 }}>
            <Image source={require('~/common/assets/images/png/icons8-down.png')} 
              style={{ marginLeft: 10 }}
            />
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontSize: 18, color: '#fff', fontWeight: 'bold' }}>
                156
              </Text>
              <Text style={{ fontSize: 18, color: '#fff', fontWeight: 'bold', opacity: 0.5 }}>
                m
              </Text>
            </View>
          </View>
          <View>
            <Text style={{
              fontSize: 24, color: '#fff', fontWeight: 'bold',
              marginTop: 30, marginLeft: 10
            }}>
              {_t('Go straight ahead')}
            </Text>
          </View>
        </View>
        <View style={{
          backgroundColor: '#00b1ec', flexDirection: 'row',
          paddingVertical: 10, paddingHorizontal: 20
        }}>
          <Text style={{
            fontSize: 16, color: '#fff'
          }}>
            {_t('In later')}
          </Text>
          <Image source={require('~/common/assets/images/png/icons8-left_up2.png')}
            style={{marginTop:3, marginLeft: 10}} 
          />
        </View>
      </View>
    )
  }
}
