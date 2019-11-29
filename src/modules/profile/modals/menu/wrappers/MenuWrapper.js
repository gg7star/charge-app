import React from 'react'
import { W, H, em, colors } from '~/common/constants'
import { View, TouchableOpacity, Image } from 'react-native'

const MenuWrapper = (props) => {
  return (
    <View 
      style={{
        position: 'absolute', zIndex: 90,
        left: 0, top: 0, width: 325, height: H,
        backgroundColor: '#fff',
        borderTopRightRadius: 20, borderBottomRightRadius: 20,
        paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20,
      }}
    >
      <View style={{marginVertical: 10}}>
        <TouchableOpacity onPressIn={props.onClose}>
          <Image source={require('~/common/assets/images/png/cross.png')}
            style={{width: 15, height: 15}} />
        </TouchableOpacity>
      </View>
      {props.children}
    </View>
  )
}

export default MenuWrapper
