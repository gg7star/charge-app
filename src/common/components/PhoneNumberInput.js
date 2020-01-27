import React from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { em, colors } from '~/common/constants';
import commonStyles from '~/common/styles';
import CustomCountryPicker from './CustomCountryPicker';

const countries = require('~/common/config/countries2.json');

export default class PhoneNumberInput extends React.Component {
  state = {
    cca2: null,
    callingCode: null,
    selectedCountry: this.props.defaultCountry || 'FR',
    openedCountryPicker: false
  }

  onOpenCountryPicker = () => {
    const { openedCountryPicker } = this.state;
    this.setState({openedCountryPicker: !openedCountryPicker});
  }

  onCloseCoutryModal = () => {
    this.setState({openedCountryPicker: false});
  };

  onChangeCountry = (country) => {
    this.setState({
      selectedCountry: country.cca2,
      cca2: country.cca2,
      callingCode: country.callingCode,
      openedCountryPicker: false
    }, () => {
      const { onChangeCountry } = this.props;
      const { cca2, callingCode } = this.state;
      onChangeCountry && onChangeCountry(cca2, callingCode);
    });
  };

  render() {
    const { containerStyles, countryPikcerStyles, placeholder } = this.props;
    const { openedCountryPicker, callingCode, selectedCountry } = this.state;
    return (
      <View style={{ position: 'relative', zIndex: 10 }}>        
        <View style={[styles.container, containerStyles && containerStyles]}>
          <View style={styles.countryViewContainer}>
            <CountryInput
              selectedCountryCode={selectedCountry}
              callingCode={callingCode}
              onOpenCountryPicker={this.onOpenCountryPicker}
            />
            {openedCountryPicker &&
              <CustomCountryPicker
                isVisible={openedCountryPicker}
                onSelect={this.onChangeCountry}
                onClose={this.onCloseCoutryModal}
              />
            }
          </View>
          <View style={styles.numberViewContainer}>
            <NumberInput
              placeholder={placeholder}
              value={this.props.phoneNumber}
              onChangePhoneNumber={
                (phoneNumber) => this.props.onChangePhoneNumber(phoneNumber)
              }
              onFocus={this.props.onFocus}
              onBlur={this.props.onBlur}
            />
          </View>
        </View>
        {openedCountryPicker && 
          <CustomCountryPicker
            isVisible={openedCountryPicker}
            onSelect={this.onChangeCountry}
            onClose={this.onCloseCoutryModal}
          />
        }
      </View>
    )
  }
}

class CountryInput extends React.Component {
  render() {
    const { selectedCountryCode, onOpenCountryPicker } = this.props;
    let selectedCountry = {};
    for (let countryCode in countries) {
      if (selectedCountryCode == countryCode) {
        selectedCountry = countries[countryCode];
        break;
      }
    }

    return ( 
      <TouchableOpacity
        style={styles.countryInputContainer}
        onPress={onOpenCountryPicker}
      >
        <Image
          source={{uri: selectedCountry['flag']}}
          style={styles.flagImage}
        />
        <Text style={styles.callingCode}>
          {`+${selectedCountry.callingCode}`}
        </Text>
        <Image
          source={require('~/common/assets/images/png/arrow2.png')}
          style={styles.dropdownArrow}
        />
      </TouchableOpacity>
    )
  }
}

class NumberInput extends React.Component {
  render() {
    return (
      <View style={styles.numberInputContainer}>
        <TextInput
          style={[styles.numberInputText,commonStyles.text.defaultWhite]}
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


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    overflow: 'hidden',
    borderRadius: 15       
  },
  countryViewContainer: {
    width: '30%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)'
  },
  numberViewContainer:  {
    width: '69%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)'
  },
  countryInputContainer: {
    paddingVertical: 18*em,
    paddingHorizontal: 12*em,
    flexDirection: 'row'
  },
  flagImage: {
    width: 22*em,
    height: 15*em
  },
  callingCode: {
    width: 40*em,
    color: '#ffffff',
    marginLeft: 4*em,
    textAlign: 'center'
  },
  dropdownArrow: {
    tintColor: '#fff',
    marginTop: 4*em,
    marginLeft: 4*em
  },
  numberInputContainer: {
    paddingVertical: 16*em,
    paddingHorizontal: 12*em
  },
  numberInputText: {
    backgroundColor: 'transparent',
    height: 17*em,
    fontSize: 17*em
  }
 });
 