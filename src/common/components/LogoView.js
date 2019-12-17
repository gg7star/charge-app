import React, { Component } from 'react';
import { StyleSheet, View, Platform, Animated } from 'react-native';
import { em } from '~/common/constants'

export default class LogoView extends Component {
  render() {
    return (
      <Animated.View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',    
          position: 'relative',
          width: '100%',
        }}
      >
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Animated.Image
            resizeMode="contain"
            style={{width: 160*em, height: 160*em, marginBottom: 20*em}}
            source={require('~/common/assets/images/png/logo-nono-2x.png')}
          />
          <Animated.Image
            resizeMode="contain"
            style={{width: 40*em}}
            source={require('~/common/assets/images/png/Ellipse-42.png')}
          />
        </View>
      </Animated.View>
    );
  }
}
