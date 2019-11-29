import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { colors } from '~/common/constants'

export default class ProfileHeader extends React.Component {
  render() {
    const { onPress, onPressOption, backImage } = this.props

    return (
      <View style={{
        marginVertical: 10
      }}>
        <View>
          <TouchableOpacity onPress={onPress}>
            {backImage ?
            <Image source={backImage}
              style={{
                tintColor: colors.primary                
              }}
            />:
            <Image source={require('~/common/assets/images/png/arrow.png')}
              style={{
                tintColor: colors.primary                
              }}
            />
            }            
          </TouchableOpacity>
        </View>
        <View style={{
          flexDirection: 'row', justifyContent: 'space-between',
          alignItems: 'center',
          marginVertical: 10
        }}>
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
      </View>
    )
  }
}
