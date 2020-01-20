import React from 'react'
import { View, ScrollView, TouchableOpacity, Image, Text } from 'react-native'

export default class SearchResults extends React.Component {
  render() {
    const { searchedPlaces } = this.props.map
    const { _t } = this.props.appActions

    return (
      <ScrollView style={{height: searchedPlaces.length>0?620:400, marginTop: 20}}>
        {searchedPlaces.map((place, index) => (
          <SearchResultItem data={place} _t={_t} key={`${index}`} 
            onPress={() => this.selectPlace(k)}
          />
        ))}
      </ScrollView>
    )
  }

  selectPlace(index) {
    this.props.selectPlace(index)
  }
}

const SearchResultItem = ({ data, onPress, _t }) => (
  <View style={{
    flexDirection: 'row', marginVertical: 20
  }}> 
    <View>
      <TouchableOpacity onPressIn={onPress}>
        <Image source={{ uri: data.image }} style={{
          width: 40, height: 40,
          borderRadius: 10
        }} />
      </TouchableOpacity>
    </View>
    <View style={{ marginLeft: 10 }}>
      <TouchableOpacity onPressIn={onPress}>
        <Text style={{
          color: '#36384a', fontSize: 17, fontWeight: 'bold'
        }}>
          {data.title}
        </Text>
      </TouchableOpacity>
      <View style={{ flexDirection: 'row', marginVertical: 5 }}>
        <Text style={{ color: '#1be497' }}>
          {_t('Open')}
        </Text>
        <Text style={{ color: '#c9c9ce'}}>
          {` ${_t('Closed')} ${_t('at')} ${data.openHour}`}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', marginLeft: 10, marginVertical: 5 }}>
        <Text style={{color: '#35cdfa'}}>
          {`${data.batteries} batteries ${data.places} places`}
        </Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Image source={require('~/common/assets/images/png/go.png')}            
        />
        <Text style={{ marginLeft: 5 }}>
          {data.distance}
        </Text>
      </View>
    </View>
  </View>
)
