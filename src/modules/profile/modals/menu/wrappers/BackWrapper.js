import React from 'react';
import { W, H } from '~/common/constants';
import { View, TouchableWithoutFeedback } from 'react-native';

const BackWrapper = (props) => {
  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <View 
        style={{
          position: 'absolute', 
          zIndex: 80, 
          left: 0, top: 0, width: W, height: H,
          backgroundColor: 'rgba(0, 0, 0, 0.44)'
        }}
      >
        {props.children}
      </View>
    </TouchableWithoutFeedback>
  )
}

export default BackWrapper
