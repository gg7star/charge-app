import React from 'react'
import { View, Text, ImageBackground, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native'
import { em, H, W } from '~/common/constants'

export default class PlacesList extends React.Component {
  state = {
    selectedIndex: 0
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { searchedPlaces, place } = nextProps.map;
   
    console.log('===== WillReceiveProps: ', nextProps);
    if (searchedPlaces && place) {
      const selectedIndex = searchedPlaces.findIndex(p => {return p.name === place.name});
      console.log('===== selectedIndex: ', selectedIndex);
      if (this.flatList && selectedIndex >= 0) {
        console.log('==== scroll to ', selectedIndex)
        this.flatList.scrollToIndex({animated: true, index: selectedIndex, viewOffset: 0, viewPosition: 0.5});
      }
    }   
  }

  onSelectPlace = (index) => {
    this.props.onSelectPlace(index)
  }

  getItemLayout = (item, index) => {
    return (
      {
        length: W,
        offset: W * index,
        index
      }    
    );
  }

  _keyExtractor = (item, index) => index;

  renderListItem = ({ item, index }) => {
    const { _t } = this.props.appActions;
    const { place } = this.props.map;
    const isSelectedItem = (place.name === item.name);
    const backgroundColor = '#FFFFFF'; //isSelectedItem ? '#f6f8fa' : '#FFFFFF';
    var itemContainerStyles = [{ 
      marginLeft: 20,
      marginRight: 20,
      marginBottom: 10,
      position: 'relative',
      width: W-40
    }];
    if (place.name === item.name) {
      itemContainerStyles.push({
        borderRadius: 23*em,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      })
    }
    
    return (
      <View style={itemContainerStyles}>
        <ImageBackground
          source={require('~/common/assets/images/png/nearSearchDialogItemBg.png')}
          resizeMode={'stretch'}
          style={{ flexDirection: 'row', width: W-40, padding: 2 }}
        >
          <View style={{backgroundColor: backgroundColor, borderRadius: 20*em, width: W-42}}>
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
}
