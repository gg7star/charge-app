import React from 'react'
import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native'

export default class SearchForm extends React.Component {
  state = {
    searchVal: ''
  }

  onChangeText = (searchVal) => {
    const { mapActions } = this.props
    this.setState({searchVal}, () => {
      mapActions.searchPlaces(this.state.searchVal)
    })
  }

  onSubmitSearch = () => {
    const { mapActions } = this.props
    const { searchVal } = this.state
    mapActions.searchPlaces(searchVal)
  }

  render() {
    const { _t } = this.props.appActions
    const { searchedPlaces } = this.props.map

    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
      >
        <View style={{ 
          flexDirection: 'row',
          backgroundColor: '#fafafa',
          borderRadius: 15,
          height: 50, alignItems: 'center'
        }}>
          <Image source={require('~/common/assets/images/png/search.png')}
            style={{ marginHorizontal: 15 }}
          />
          <TextInput
            style={{ width: 210, fontSize: 17 }}
            placeholder={_t('Search')}
            value={this.state.searchVal}
            onChangeText={searchVal => this.onChangeText(searchVal)}
            onSubmitEditing={this.onSubmitSearch}
          />
        </View>
        <View>
          <TouchableOpacity style={{
            backgroundColor: '#fff'            ,
            paddingVertical: 5, paddingHorizontal: 10,
            height: 50, justifyContent: 'center'
          }} onPressIn={this.props.onCancel}>
            <Text style={{
              color: searchedPlaces.length>0?'#35cdfa':'#bfbfc4', fontSize: 17
            }}>
              {_t('Cancel')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
