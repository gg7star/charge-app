import React from 'react'
import { View, Image, Text, TouchableOpacity } from 'react-native'
import { colors } from '~/common/constants'

const MenuItem = (props) => (
  <TouchableOpacity style={{
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 15,
  }} onPress={props.onPress}>
    <View style={{
      marginRight: 10,
      flexDirection: 'row'
    }}>
      <Image source={props.image} style={{
        width: 20, height: 20, tintColor: colors.primary,
        marginRight: 5
      }} />
      <Text style={{
        fontSize: 16, fontWeight: '400'
      }}>
        {props.title}
      </Text>
    </View>
    <View style={{
    }}>
      {props.subtitle &&
      <Text style={{
        fontSize: 13, fontWeight: '300'
      }}>
        {props.subtitle}
      </Text>
      }
    </View>
  </TouchableOpacity>
)

export default MenuItem
