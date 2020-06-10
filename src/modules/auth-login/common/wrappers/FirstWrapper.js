import React from 'react';
import {
  View,
  ImageBackground,
  ScrollView,
  Animated,
  Keyboard,
  Platform,
  LayoutAnimation,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';
import { W, H, em } from '~/common/constants';
import { KeyboardAvoidingView } from '~/common/components';
import { Spacer, Button } from '~/common/components';
import LogoView from '~/common/components/LogoView';

export default class FirstWrapper extends React.Component {
  state = {
    anim: new Animated.Value(0),
    isKeyboardVisible: false,
    keyboardHeight: 0,
    adjust: {
      mostTop: Platform.OS === 'ios' ? 160*em : 100*em
    }
  };

  UNSAFE_componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      Platform.select({ android: 'keyboardDidShow', ios: 'keyboardWillShow' }),
      this._keyboardDidShow.bind(this),
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      Platform.select({ android: 'keyboardDidHide', ios: 'keyboardWillHide' }),
      this._keyboardDidHide.bind(this),
    );
  }

  componentDidMount() {
    Animated.timing(this.state.anim, { toValue: 3000, duration: 3000 }).start();
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow(e) {
    LayoutAnimation.easeInEaseOut();
    this.setState({
      isKeyboardVisible: true,
      keyboardHeight: e.endCoordinates.height
    });
  }

  _keyboardDidHide() {
    LayoutAnimation.easeInEaseOut();
    this.setState({ isKeyboardVisible: false });
  }

  fadeIn(delay, from = 0) {
    const { anim } = this.state;
    return {
      opacity: anim.interpolate({
        inputRange: [delay, Math.min(delay + 500, 3000)],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      }),
      transform: [
        {
          translateY: anim.interpolate({
            inputRange: [delay, Math.min(delay + 500, 3000)],
            outputRange: [from, 0],
            extrapolate: 'clamp',
          }),
        },
      ],
    };
  }

  render() {
    const { children } = this.props;
    return (
      <ImageBackground
        source={require('~/common/assets/images/png/login-bg.jpg')}
        style={{flex: 1, height: H}}
        resizeMode='cover'
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>       
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 20*em
          }}
        >
          <View style={{width: '100%', padding: 0}}>
            <Spacer size={this.state.isKeyboardVisible ? 0 : this.state.adjust.mostTop} />
            <View>
            <LogoView styles={this.fadeIn(0)} />
            <Spacer size={20*em} />
            {children}
            </View>
            {/* <Spacer size={20*em} /> */}
          </View>
        </View>
        </TouchableWithoutFeedback>
      </ImageBackground>
    )
  }
}
