import React from 'react';
import { View, TouchableOpacity, Image, TouchableWithoutFeedback } from 'react-native';
import { W, H } from '~/common/constants';
import { Spacer } from '~/common/components';
const CLOSE_IMAGE = require('~/common/assets/images/png/cross.png');

const MenuWrapper = (props) => {
  return (
    <View 
      style={{
        position: 'absolute', zIndex: 90,
        left: 0, top: 0, width: W*0.8, height: H,
        backgroundColor: '#fff',
        borderTopRightRadius: 20, borderBottomRightRadius: 20,
        paddingTop: 20, paddingBottom: 20, paddingHorizontal: 20,
      }}
    >
      <TouchableOpacity
        onPressIn={props.onClose}
        style={{width: 50, height: 50, alignItems: 'flex-start', justifyContent: 'center'}}
      >
        <Image source={CLOSE_IMAGE} style={{width: 15, height: 15}} />
      </TouchableOpacity>
      <Spacer size={50} />
      {props.children}
    </View>
  )
}

export default MenuWrapper
