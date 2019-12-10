import React from 'react'
import { View, Text, ImageBackground, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native'
import { em } from '~/common/constants'

export default class PlacesList extends React.Component {
  render() {
    const { searchedPlaces, place } = this.props.map;
    const itemIndex = searchedPlaces.findIndex(p => {return p.name === place.name});
    return (
      <View style={{ marginHorizontal: -20 }}>
        <FlatList
          data={searchedPlaces}
          renderItem={this.renderListItem}
          keyExtractor={this._keyExtractor}
          horizontal
          getItemLayout={(data, index) => this.getItemLayout(data, index)}
          initialScrollIndex={itemIndex}
          ref={ref => (this.flatList = ref)}
        />       
      </View>
    )
  }

  renderListItem = ({ item, index }) => {
    const { _t } = this.props.appActions;
    const { place } = this.props.map
    const backgroundColor = (place.name === item.name) ? '#f6f8fa' : '#FFFFFF'
    return (
      <View style={{ marginLeft: 20, position: 'relative' }}>
        <View style={{ position: 'absolute', top: 20, right: 20, zIndex: 50 }}>
          <TouchableOpacity onPress={() => this.onSelectPlace(index)}>
            <Image
              source={require('~/common/assets/images/png/options.png')} 
              style={{ tintColor: '#bfbfc4' }}
            />
          </TouchableOpacity> 
        </View>
        <ImageBackground
          source={require('~/common/assets/images/png/nearSearchDialogItemBg.png')}
          resizeMode={'stretch'}
          style={{ flexDirection: 'row' }}
        >
          <View style={{backgroundColor: backgroundColor, padding: 2, borderRadius: 20}}>
          <TouchableOpacity
            style={{flexDirection: 'row', margin: 20}}
            onPress={() => this.onSelectPlace(index)}
          >
            <View>
              <Image
                source={{ uri: item.image }}
                style={{ width: 40, height: 40, borderRadius: 10 }}
              />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={{
                color: '#36384a', fontSize: 17, fontWeight: 'bold'
              }}>
                {item.title}
              </Text>
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
          </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    )
  }

  onSelectPlace = (index) => {
    this.props.onSelectPlace(index)
  }

  getItemLayout = (data, index) => {
    return (
      {
        width: 132,
        offset: 132 * index,
        index
      }    
    );
  }

  _keyExtractor = (item, index) => item.name;
}
