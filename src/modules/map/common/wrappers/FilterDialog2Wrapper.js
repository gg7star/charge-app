import React from 'react'
import { View, TouchableOpacity, Image, Text } from 'react-native'
import { W } from '~/common/constants'

const FilterDialog2Wrapper = ({ children, onClose, onOpenFilter, onClear, _t }) => (
  <View
    style={{
      position: 'absolute',
      bottom: 0, left: 0, zIndex: 50,
      width: W, 
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      backgroundColor: '#5ed8fc'
    }}
  >
    <View
      style={{
        borderTopLeftRadius: 20, borderTopRightRadius: 20,
        backgroundColor: '#fff',
        paddingHorizontal: 20, paddingBottom: 40
      }}
    >
      {onClose && 
        <TouchableOpacity
          onPress={onClose}
          style={{
            position: 'absolute',
            right: 0, top: 0, zIndex: 51,
            paddingRight: 20, paddingTop: 20,
            width: 50, height: 50,
            alignItems: 'flex-end'
          }}
        >
          <Image
            source={require('~/common/assets/images/png/cross.png')}
            style={{ tintColor: '#bfbfc4' }}
          />
        </TouchableOpacity>
      }
      {children}
    </View>
  </View>
)

export default FilterDialog2Wrapper
