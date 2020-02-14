import React from 'react'
import { View, Platform, Image, TouchableOpacity, Text } from 'react-native'
import { em, colors } from '~/common/constants'

const LEFT_ARROW_IMAGE = require('~/common/assets/images/png/arrow.png');
const NONO_IMAGE = require('~/common/assets/images/png/Union-32.png');
const RIGHT_ARROW_IMAGE = require('~/common/assets/images/png/cross.png');

const HintWrapper = ({ children, onGoBack, onClose }) => (
  <View style={styles.headerContainer}>
    <Header onGoBack={onGoBack} onClose={onClose} />
    {children}
  </View>
)

const Header = ({ onGoBack, onClose }) => (
  <View style={styles.container}>
    <TouchableOpacity style={styles.leftContainer} onPress={onGoBack}>
      { onGoBack && <Image source={LEFT_ARROW_IMAGE} style={styles.leftImage}/> }
    </TouchableOpacity>  
    <View style={styles.centerContainer}>
      <Image source={NONO_IMAGE} style={styles.centerImage} />
    </View>
    <TouchableOpacity style={styles.rightContainer} onPress={onClose}>
      <Image source={RIGHT_ARROW_IMAGE} style={styles.rightImage} />
    </TouchableOpacity>
  </View>
)

export default HintWrapper

const styles = {
  headerContainer: {
    flex: 1,
    position: 'relative',
    paddingHorizontal: 20*em, 
    backgroundColor: '#fff'
  },
  container: {
    marginTop: 40*em, marginBottom: 10*em,
    flexDirection: 'row', justifyContent: 'space-between'
  },
  leftContainer: {
    width: 50*em, height: 50*em,
    alignItems: 'flex-start', justifyContent: 'center'
  },
  leftImage: {
    width: 13*em, height: 20*em, tintColor: '#35cdfa'
  },
  centerContainer: {
    alignItems: 'center', justifyContent: 'center'
  },
  centerImage: {
    width: 79*em, height: 18*em
  },
  rightContainer: {
    width: 50*em, height: 50*em, alignItems: 'flex-end', justifyContent: 'center'
  },
  rightImage: {
    width: 16*em, height: 16*em, marginTop: 2*em
  }
};
