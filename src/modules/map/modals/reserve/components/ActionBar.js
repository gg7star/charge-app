import React from 'react'
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { Button } from '~/common/components'
import { em } from '~/common/constants'

export default class ActionBar extends React.Component {
  state = {
    bookCount: 1
  }

  render() {
    const { _t } = this.props.appActions
    const { data } = this.props
    const { bookCount } = this.state

    return (
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 20,
        paddingHorizontal: 20, paddingVertical: 10,
        backgroundColor: '#5ed8fc'
      }}>
        <View style={{ width: 190*em }}>
          <Text style={{
            fontSize: 16, color: '#fff', lineHeight: 24
          }}>
            {_t('Book')}
          </Text>
        </View>
        <View style={{ 
          width: 130*em, 
          alignItems: 'flex-end', flexDirection: 'row'
        }}>
          <TouchableOpacity onPress={this.decreaseBookCount}>
            <Image source={require('~/common/assets/images/png/moins.png')} 
              style={styles.actButton}
            />
          </TouchableOpacity>
          <Text style={{ color: '#fff', fontSize: 16, lineHeight: 24}}>
            {bookCount}
          </Text>
          <TouchableOpacity onPress={this.increaseBookCount}>
            <Image source={require('~/common/assets/images/png/plus.png')} 
              style={styles.actButton}
            />
          </TouchableOpacity>
        </View>        
      </View>
    )
  }

  decreaseBookCount = () => {
    let { bookCount } = this.state
    if (bookCount == 1) return
    bookCount--
    this.setState({
      ...this.state,
      bookCount
    })
  }

  increaseBookCount = () => {
    let { bookCount } = this.state
    bookCount++
    this.setState({
      ...this.state,
      bookCount
    })
  }
}

const styles = StyleSheet.create({
  actButton: {
    opacity: 0.8,
    width: 26, height: 26,
    marginHorizontal: 10
  }
})
