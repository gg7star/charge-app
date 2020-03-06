import React from 'react'
import { View, Text, ImageBackground, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native'
import { em, H, W } from '~/common/constants'
import { openHourStatus } from '~/common/utils/time';

export default class PlacesList extends React.Component {
  state = {
    selectedIndex: 0
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { searchedPlaces, place } = nextProps.map;
   
    if (searchedPlaces && place) {
      const selectedIndex = searchedPlaces.findIndex(p => p.name === place.name);
      if (this.flatList && selectedIndex >= 0) {
        this.flatList.scrollToIndex({
          animated: true,
          index: selectedIndex,
          viewOffset: 0,
          viewPosition: 0.5
        });
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
    const backgroundColor = '#FFFFFF';
    var itemContainerStyles = [{ 
      marginLeft: 20,
      marginRight: 20,
      marginBottom: 10,
      position: 'relative',
      width: W-40
    }];
    const hourStatus = openHourStatus(item.openHours);
    
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
                  <Text style={{ color: (hourStatus.openStatus ? '#1be497' : '#c9c9ce') }}>
                    {hourStatus.openStatus
                      ? `${_t('Opened at')} ${hourStatus.hour}`
                      : `${_t('Closed at')} ${hourStatus.hour}`
                    }
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
        {this.renderListItem({item: searchedPlaces[itemIndex], index: itemIndex})}
        {/* <FlatList
          data={searchedPlaces}
          renderItem={this.renderListItem}
          keyExtractor={this._keyExtractor}
          horizontal
          getItemLayout={(data, index) => this.getItemLayout(dat  a, index)}
          initialScrollIndex={itemIndex}
          ref={ref => (this.flatList = ref)}
        />        */}
      </View>
    )
  }
}
