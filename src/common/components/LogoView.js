import React, { Component } from 'react';
import { StyleSheet, View, Platform, Animated } from 'react-native';
import { em, H } from '~/common/constants';

export default class LogoView extends Component {
  render() {
    const { style } = this.props;
    return (
      <Animated.View
        style={[{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',    
          position: 'relative',
          width: '100%',
        }, style && style]}
      >
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Animated.Image
            resizeMode="contain"
            style={{width: 160*em, height: (H < 700 ? 110 : 160)*em, marginBottom: 5*em}}
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
