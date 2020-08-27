import React from 'react'
import { View, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native'
import { em } from '~/common/constants'

const PROFILE_IMAGE = require('~/common/assets/images/png/profile.png');
const GIFT_IMAGE = require('~/common/assets/images/png/gift.png');
const TREE_IMAGE = require('~/common/assets/images/png/tree.png');
const SEARCH_IMAGE = require('~/common/assets/images/png/search.png');
const REFRESH_IMAGE = require('~/common/assets/images/png/refresh.png');
const POSITION_IMAGE = require('~/common/assets/images/png/position.png');

export default class MapButton extends React.Component {
  render() {
    const {name, onPress} = this.props

    switch(name) {
      case 'profile':
        return (
          <Button
            style={[styles.button, styles.profile, styles.shadowStyle]}
            onPress={onPress}
            image={PROFILE_IMAGE}
          />
        )
      case 'gift':
        return (
          <Button
            style={[styles.button, styles.gift]} 
            onPress={onPress}
            image={GIFT_IMAGE}
          />
        )
      case 'tree':
        return (
          <Button
            style={[styles.button, styles.tree, styles.shadowStyle]} 
            onPress={onPress}
            image={TREE_IMAGE}
          />
        )
      case 'search':
        return (
          <Button
            style={[styles.button, styles.search]} 
            onPress={onPress}
            image={SEARCH_IMAGE}
          />
        )
      case 'refresh':
        return (
          <Button
            style={[styles.button, styles.refresh, styles.shadowStyle]} 
            onPress={onPress}
            image={REFRESH_IMAGE}
          />
        )
      case 'position':
        return (
          <Button
            style={[styles.button, styles.position, styles.shadowStyle]} 
            onPress={onPress}
            image={POSITION_IMAGE}
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
    position: 'absolute',
    zIndex: 15,
    width: 50*em,
    height: 50*em,
    borderRadius: 20*em,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  shadowStyle: {
    ...Platform.select({
      ios: {
        // shadowColor: "#000000",
        shadowOffset: { width: 1, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 5,
      },
    })
  },
  profile: {
    top: 50,
    left: 13
  },
  gift: {
    top: 50,
    right: 20
  },
  tree: {
    top: 50,
    right: 13
  },
  search: {
    bottom: 220,
    right: 20
  },
  refresh: { 
    bottom: 212,
    right: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  position: {
    bottom: 150,
    right: 20,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0
  }
})
