import React from 'react'
import { View, Image, TouchableOpacity } from 'react-native'
import { W } from '~/common/constants'

const Dialog2Wrapper = ({ children, onClose }) => (
  <View style={{
    position: 'absolute', bottom: 0, left: 0, zIndex: 50,
    width: W, 
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    backgroundColor: '#fff',
    paddingHorizontal: 20, paddingBottom: 40
  }}>
    <View style={{
      alignItems: 'center', justifyContent: 'center', 
      paddingVertical: 8
    }}>
      <Image source={require('~/common/assets/images/png/slide.png')} 
        style={{
          tintColor: '#bfbfc4'
        }}
      />
    </View>
    {onClose && 
    <View style={{
      position: 'absolute', right: 20, top: 20, zIndex: 50
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

export default Dialog2Wrapper
