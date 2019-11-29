import React from 'react'
import { View, Image, TouchableOpacity } from 'react-native'
import { W } from '~/common/constants'

const FeedbackDialogWrapper = ({ children, onClose }) => (
  <View style={{
    position: 'absolute', bottom: 40, left: 0, zIndex: 50,
    width: W-40, marginHorizontal: 20,
    borderRadius: 20, 
    backgroundColor: '#fff',
    paddingHorizontal: 20, paddingVertical: 20
  }}>
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

export default FeedbackDialogWrapper
