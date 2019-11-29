import React from 'react'
import { View, TouchableOpacity, Image, Text } from 'react-native'
import { W } from '~/common/constants'

const FilterDialog2Wrapper = ({ children, onClose, onOpenFilter, onClear, _t }) => (
  <View style={{
    position: 'absolute', bottom: 0, left: 0, zIndex: 50,
    width: W, 
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    backgroundColor: '#5ed8fc'
  }}>
    <View style={{ 
      paddingVertical: 20, paddingHorizontal: 20,
      flexDirection: 'row', justifyContent: 'space-between'
    }}>
      <View style={{
        flexDirection: 'row'
      }}>
        <Image source={require('~/common/assets/images/png/filter.png')}
          style={{ width: 16, height: 16 }}
        />
        <TouchableOpacity onPress={onOpenFilter}>
          <Text style={{ fontSize: 17, color: '#fff', fontWeight: 'bold', marginLeft: 10}}>
            {_t('Filters')}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ opacity: 0.5 }}>
        <TouchableOpacity onPress={onClear}>
          <Text style={{
            fontSize: 17, color: '#fff', fontWeight: 'bold'
          }}>
            {_t('Clear')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
    <View style={{
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
  </View>
)

export default FilterDialog2Wrapper
