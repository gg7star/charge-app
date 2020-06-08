import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  Image,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { em } from '~/common/constants';

export default class Button extends React.Component {
  render() {
    const {
      onPress,
      bgGradientStart,
      containerHeight,
      borderRadius,
      disabled
    } = this.props

    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        accessibilityTraits='button'
        style={{
          width: '100%',
          height: containerHeight,
          borderRadius,
          overflow: 'hidden',
        }}
        disabled={disabled}
      >
        {!bgGradientStart
          ? this.renderDefaultButton()
          : this.renderGradientButton()
        }
      </TouchableOpacity>
    )
  }

  renderDefaultButton = () => {
    const { bgColor } = this.props

    return (
      <View style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bgColor,
        position: 'relative'
      }}>
        {this.renderContent()}
      </View>
    )
  }

  renderGradientButton = () => {
    const { bgGradientStart, bgGradientEnd } = this.props
    return (
      <LinearGradient style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }} start={{x: 0.5, y:1}} end={{x:1, y:1}} colors={[bgGradientStart, bgGradientEnd]}
      >
        {this.renderContent()}
      </LinearGradient>
    )
  }

  renderContent = () => {
    const { caption, loading, textSize, textColor, icon, iconAlign, iconColor, children } = this.props
    return (
      <>
        {loading?
          <ActivityIndicator color={textColor} />
        :
          children ? children :
          <>
            {icon && iconAlign=='left-corner' &&
              <Image resizeMode='contain' source={icon} style={{
                tintColor: iconColor, maxWidth: 20, maxHeight: 20,
                position: 'absolute', left: 10, top: 10, 
              }} />
            }
            {icon && iconAlign=='left' &&
              <Image resizeMode='contain' source={icon} style={{
                tintColor: iconColor, maxWidth: 20, maxHeight: 20, marginRight: 10
              }} />
            }
            <Text style={{
              fontSize: textSize, color: textColor
            }}>
              {caption}
            </Text>
            {icon && iconAlign=='right' &&
              <Image resizeMode='contain' source={icon} style={{
                tintColor: iconColor, maxWidth: 20, maxHeight: 20, marginLeft: 10
              }} />
            }
            {icon && iconAlign=='right-corner' &&
              <Image resizeMode='contain' source={icon} style={{
                tintColor: iconColor, maxWidth: 20, maxHeight: 20,
                position: 'absolute', right: 10, top: 10,
              }} />
            }
          </>        
        }
      </>
    )
  }
}

Button.defaultProps = {
  containerHeight: 50*em,
  borderRadius: 20*em,
  textSize: 17*em,
  textColor: '#00a9f2',
  bgColor: '#fff',
  iconAlign: 'left',
  iconColor: '#fff',
  disabled: false
}