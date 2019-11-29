import React from 'react'
import { View, TouchableOpacity, Image } from 'react-native'
import { W } from '~/common/constants'
import LinearGradient from 'react-native-linear-gradient'

const RentDialogWrapper = ({ children }) => (
  <View style={{
    position: 'absolute', bottom: 0, left: 0, zIndex: 30,
    width: W, 
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    backgroundColor: '#fff',    
    overflow: 'hidden'
  }}>
    <LinearGradient
      start={{ x:1, y: 0 }}
      end={{ x: 1, y: 1 }}
      colors={['#ffdf00', '#ff52a8']}      
    >
      <View style={{
        alignItems: 'center', justifyContent: 'center', 
        paddingVertical: 8
      }}>
        <Image source={require('~/common/assets/images/png/slide.png')} 
          style={{
            tintColor: '#fff'
          }}
        />
      </View>
      <View style={{
        paddingHorizontal: 20, 
        paddingBottom: 40
      }}>
        {children}
      </View>
    </LinearGradient>    
  </View>
)

export default RentDialogWrapper
