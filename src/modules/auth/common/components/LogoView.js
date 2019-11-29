import React, { Component } from 'react';
import { StyleSheet, View, Platform, Animated } from 'react-native';
import { em } from '~/common/constants'

export default class LogoView extends Component {
  render() {
    return (
      <Animated.View style={{
        flexDirection: 'row',
        alignItems: 'center', justifyContent: 'center',    
        position: 'relative',
        width: '100%',
      }}>
        <View style={{
          left: -100*em, top:-70*em, position: 'absolute',
        }}>
          <Animated.Image
            resizeMode="contain"
            style={{
              width: 162*em, height: 198*em
            }}
            source={require('~/common/assets/images/png/flash-left-2x.png')}
          />
        </View>
        
        <View style={{
          justifyContent: 'center', alignItems: 'center'
        }}>
          <Animated.Image
            resizeMode="contain"
            style={{
              width: 160*em, height: 160*em, marginBottom: 20*em
            }}
            source={require('~/common/assets/images/png/logo-nono-2x.png')}
          />
          <Animated.Image
            resizeMode="contain"
            style={{
              width: 40*em
            }}
            source={require('~/common/assets/images/png/Ellipse-42.png')}
          />
        </View>
        <View style={{
          right: -100*em, top: -70*em, position: 'absolute'
        }}>
          <Animated.Image
            resizeMode="contain"
            style={{
              width: 162*em, height: 198*em
            }}
            source={require('~/common/assets/images/png/flash-right-2x.png')}
          />

        </View>
        
      </Animated.View>
    );
  }
}
