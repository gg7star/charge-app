import React from 'react'
import { View, TouchableOpacity, Image } from 'react-native'
import { W } from '~/common/constants'

const DialogWrapper = ({ children, onClose, transparent }) => (
  <View style={[{
    position: 'absolute', bottom: 0, left: 0, zIndex: 30,
    width: W, 
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    backgroundColor: transparent ? '#ffffff00' : '#ffffff',
    padding: 20
  }]}>
    {onClose && 
    <View style={{
      position: 'absolute', right: 20, top: 20, zIndex: 50,
    }}>
      <TouchableOpacity onPress={onClose}>
        <Image source={require('~/common/assets/images/png/cross.png')}
          style={{ tintColor: '#bfbfc4' }}
        />
      </TouchableOpacity>
    </View>
    }
    {children}
  </View>
)

export default DialogWrapper
