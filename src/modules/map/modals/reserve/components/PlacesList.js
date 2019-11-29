import React from 'react'
import { View, Text, ImageBackground, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native'
import { Button } from '~/common/components'
import { em } from '~/common/constants'

export default class PlacesList extends React.Component {
  render() {
    const { searchedPlaces } = this.props.map

    return (
      <View style={{ marginHorizontal: -20 }}>
        <FlatList
          data={searchedPlaces}
          renderItem={this.renderListItem}
          horizontal
        />       
      </View>
    )
  }

  renderListItem = ({ item, index }) => {
    const { _t } = this.props.appActions
    return (
      <View style={{ 
        marginLeft: 20, position: 'relative',      
      }}>
        <View style={{ position: 'absolute', top: 20, right: 20, zIndex: 50 }}>
          <TouchableOpacity onPress={() => this.onSelectPlace(index)}>
            <Image source={require('~/common/assets/images/png/options.png')} 
              style={{ tintColor: '#bfbfc4' }}
            />
          </TouchableOpacity> 
        </View>
        <ImageBackground
          source={require('~/common/assets/images/png/nearSearchDialogItemBg.png')}
          resizeMode={'stretch'}
          style={{ flexDirection: 'row' }}
        >
          <View style={{
            flexDirection: 'row', margin: 20
          }}> 
            <View>
              <TouchableOpacity onPress={() => this.onSelectPlace(index)}>
                <Image source={{ uri: item.image }} style={{
                  width: 40, height: 40,
                  borderRadius: 10
                }} />
              </TouchableOpacity>
            </View>
            <View style={{ marginLeft: 10 }}>
              <TouchableOpacity onPress={() => this.onSelectPlace(index)}>
                <Text style={{
                  color: '#36384a', fontSize: 17, fontWeight: 'bold'
                }}>
                  {item.title}
                </Text>
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                <Text style={{ color: '#1be497' }}>
                  {_t('Open')}
                </Text>
                <Text style={{ color: '#c9c9ce'}}>
                  {` ${_t('Closed')} ${_t('at')} ${item.openHour}`}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                <Text style={{color: '#35cdfa'}}>
                  {`${item.batteries} batteries ${item.places} places`}
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    )
  }

  onSelectPlace = (index) => {
    this.props.onSelectPlace(index)
  }
}
