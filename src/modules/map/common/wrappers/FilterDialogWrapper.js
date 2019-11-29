import React from 'react'
import { View, TouchableOpacity, Image, Text } from 'react-native'
import { W } from '~/common/constants'

const FilterDialogWrapper = ({ children, onClear, _t }) => (
  <View style={{
    position: 'absolute', bottom: 0, left: 0, zIndex: 50,
    width: W, 
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    backgroundColor: '#5ed8fc', 
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40
  }}>
    <View style={{ 
      flexDirection: 'row', justifyContent: 'space-between'
    }}>
      <View style={{
        flexDirection: 'row'
      }}>
        <Image source={require('~/common/assets/images/png/filter.png')}
          style={{ width: 16, height: 16 }}
        />
        <TouchableOpacity>
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
          
    {children}
  </View>
)

export default FilterDialogWrapper
