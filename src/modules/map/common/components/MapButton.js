import React from 'react'
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { em } from '~/common/constants'

export default class MapButton extends React.Component {
  render() {
    const { name, onPress } = this.props

    switch(name) {
      case 'profile':
        return (
          <Button style={[ styles.button, { top: 50, left: 20 } ]} 
            onPress={onPress}
            image={require('~/common/assets/images/png/profile.png')}
          />
        )
      case 'gift':
        return (
          <Button style={[ styles.button, { top: 50, right: 20 } ]} 
            onPress={onPress}
            image={require('~/common/assets/images/png/free-credits.png')}
          />
        )
      case 'search':
        return (
          <Button style={[ styles.button, { bottom: 220, right: 20 } ]} 
            onPress={onPress}
            image={require('~/common/assets/images/png/search.png')}
          />
        )
      case 'refresh':
        return (
          <Button style={[ styles.button, { bottom: 151, right: 20, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, } ]} 
            onPress={onPress}
            image={require('~/common/assets/images/png/refresh.png')}
          />
        )
      case 'position':
        return (
          <Button style={[ styles.button, { bottom: 100, right: 20, borderTopLeftRadius: 0, borderTopRightRadius: 0 } ]} 
            onPress={onPress}
            image={require('~/common/assets/images/png/position.png')}
          />
        )
      default: 
        return (
          <>
          </>
        )
    }
  }
}

const Button = ({ image, onPress, style }) => (
  <TouchableOpacity style={style} onPress={onPress}>
    <Image source={image} />
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  button: {
    position: 'absolute', zIndex: 15,
    width: 50*em, height: 50*em,
    borderRadius: 20*em, backgroundColor: '#fff',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
  }
})
