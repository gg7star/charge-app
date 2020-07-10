import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { colors } from '~/common/constants'
const BACK_IMAGE = require('~/common/assets/images/png/arrow.png');
export default class ProfileHeader extends React.Component {
  render() {
    const { onPress, onPressOption, backImage } = this.props

    return (
      <React.Fragment>
        <TouchableOpacity onPress={onPress} style={{width: 50, height: 50, zIndex: 51, alignItems: 'flex-start', justifyContent: 'center'}}>
          {backImage ? (
            <Image source={backImage} style={{tintColor: colors.primary}} />
          ) : (
            <Image source={BACK_IMAGE} style={{tintColor: colors.primary}}/>
          )}
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginVertical: 10
          }}
        >
          <Text style={{ fontSize: 26, fontWeight: 'bold' }}>
            {this.props.title}
          </Text>
          {onPressOption && 
            <TouchableOpacity onPress={onPressOption}>
              <Image source={require('~/common/assets/images/png/option3.png')}
              /> 
            </TouchableOpacity>
          }
        </View>
      </React.Fragment>
    )
  }
}
