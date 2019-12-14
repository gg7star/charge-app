import React from 'react';
import { View, Text, TextInput, Image, ScrollView, TouchableOpacity } from 'react-native';
import { em, colors } from '~/common/constants';
import commonStyles from '~/common/styles';

const countries = require('~/common/config/countries.json');

export default class PhoneNumberInput extends React.Component {
  state = {
    selectedCountry: this.props.defaultCountry || 'FR',
    openedCountryPicker: false
  }

  render() {
    const { placeholder } = this.props
    const { containerStyles, countryPikcerStyles } = this.props
    const { openedCountryPicker } = this.state
    return (
      <View style={{ position: 'relative', zIndex: 10 }}>        
        <View
          style={
            [
              {
                flexDirection: 'row', width: '100%', justifyContent: 'space-between',
                overflow: 'hidden', borderRadius: 15,          
              },
              containerStyles && {}
            ]
          }
        >
          <View style={{
            width: '20%',
            backgroundColor: 'rgba(255, 255, 255, 0.15)'
          }}>
            <CountryInput
              selectedCountry={this.state.selectedCountry} 
              onOpenCountryPicker={this.onOpenCountryPicker}
            />
          </View>
          <View style={{
            width: '79%',
            backgroundColor: 'rgba(255, 255, 255, 0.15)'
          }}>
            <NumberInput
              placeholder={placeholder}
              value={this.props.phoneNumber}
              onChangePhoneNumber={(phoneNumber) => this.props.onChangePhoneNumber(phoneNumber)}
              onFocus={this.props.onFocus}
              onBlur={this.props.onBlur}
            />
          </View>
        </View>
        <View style={{
          position: 'absolute', top: 50, left: 0, zIndex: 100
        }}>
          {openedCountryPicker &&
            <CountryPicker
              styles={countryPikcerStyles} 
              onChangeCountry={this.onChangeCountry}
            />
          }          
        </View>
      </View>
    )
  }

  onOpenCountryPicker = () => {
    this.setState({
      ...this.state,
      openedCountryPicker: !this.state.openedCountryPicker
    })
  }

  onChangeCountry = (selectedCountry, code) => {    
    this.setState({
      ...this.state,
      selectedCountry,
      openedCountryPicker: false
    }, () => {
      const { onChangeCountry } = this.props;
      if(onChangeCountry)
        onChangeCountry(this.state.selectedCountry, code);
    })
  }
}

class CountryInput extends React.Component {
  render() {
    const selectedCountryCode = this.props.selectedCountry
    let selectedCountry = {};
    for (let countryCode in countries) {
      if (selectedCountryCode == countryCode) {
        selectedCountry = countries[countryCode]
        break
      }
    }

    return ( 
      <TouchableOpacity
        style={{
          paddingVertical: 18*em,
          paddingHorizontal: 12*em,
          flexDirection: 'row'
        }}
        onPress={this.props.onOpenCountryPicker}
      >
        <Image
          source={{uri: selectedCountry['flag']}}
          style={{width: 22*em, height: 15*em}}
        />
        <Image
          source={require('~/common/assets/images/png/arrow2.png')}
          style={{tintColor: '#fff', marginTop: 4*em, marginLeft: 4*em}}
        />
      </TouchableOpacity>
    )
  }
}

class CountryPicker extends React.Component {
  render() {    
    return (
      <ScrollView
        style={{
          height: 150*em,
          backgroundColor: colors.primaryBackground
        }}
      >
        {Object.keys(countries).map((countryCode) => (
          <TouchableOpacity 
            key={countryCode}
            style={{flexDirection: 'row', padding: 5*em}}
            onPressOut={() => this.props.onChangeCountry(countryCode, countries[countryCode]['callingCode'])}
          >
            <Image
              source={{uri: countries[countryCode]['flag']}}
              style={{width: 22*em, height: 15*em, marginRight: 8*em}}
            />
            <Text style={[commonStyles.text.defaultWhite, {paddingHorizontal: 2}]}>
              {countryCode}
            </Text>
            <Text style={[commonStyles.text.defaultWhite, {paddingHorizontal: 2}]}>
              +{countries[countryCode]['callingCode']}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    )
  }
}

class NumberInput extends React.Component {
  render() {
    return (
      <View style={{paddingVertical: 16*em, paddingHorizontal: 12*em}}>
        <TextInput
          style={[
            {
              backgroundColor: 'transparent',
              height: 17*em, fontSize: 17*em,
            },
            commonStyles.text.defaultWhite
          ]} 
          placeholder={this.props.placeholder}
          placeholderTextColor={'#fff'} 
          value={this.props.phoneNumber}
          onChangeText={(phoneNumber) => this.props.onChangePhoneNumber(phoneNumber)}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
          keyboardType='number-pad'
        />
      </View>
    )
  }
}
