
import React from 'react';
import CountryPicker, {
  DARK_THEME
} from 'react-native-country-picker-modal'

export default class CustomCountryPicker extends React.Component {
  
  onSelect = (country) => {
    const { onSelect } = this.props;
    onSelect && onSelect(country);
  };

  onClose = () => {
    const { onClose } = this.props;
    onClose && onClose();
  };

  render() {
    const { isVisible } = this.props
    return (
      <CountryPicker
        withFilter
        withFlag
        withAlphaFilter
        withCallingCode
        withEmoji
        theme={DARK_THEME}
        visible={isVisible}
        onSelect={this.onSelect}
        onClose={this.onClose}
      />
    );
  }
};
