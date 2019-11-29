import React from 'react'
import { View, Platform, Image, TouchableOpacity, Text, ScrollView } from 'react-native'
import { W, H, em, colors } from '~/common/constants'
import commonStyles from '~/common/styles'

const SetWrapper = ({ children, onGoBack, onPass, passText }) => (
  <View style={{
    flex: 1, position: 'relative', 
    paddingHorizontal: 20*em,
    backgroundColor: colors.primaryBackground,
  }}>
    <Header onGoBack={onGoBack} onPass={onPass} passText={passText} />
    {children}
  </View>
)

const Header = ({ onGoBack, onPass, passText }) => (
  <View style={{
    marginTop: 60*em, marginBottom: 30*em,
    flexDirection: 'row', justifyContent: 'space-between'
  }}>
    <View>
      {onGoBack &&
      <TouchableOpacity onPress={onGoBack}>
        <Image source={require('~/common/assets/images/png/arrow.png')}
          style={{width: 13*em, height: 20*em, tintColor: '#fff'}}
        />
      </TouchableOpacity>      
      }      
    </View>
    <View>
      {onPass &&
      <TouchableOpacity onPress={onPass}>
        <Text style={[commonStyles.text.defaultWhite, {fontSize: 17*em, lineHeight: 20*em}]}>
          {passText}
        </Text>
      </TouchableOpacity>
      }
    </View>    
  </View>
)

export default SetWrapper
