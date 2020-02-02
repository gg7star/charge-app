const countries = require('~/common/config/countries2.json');

export function convertLanguage2CallingCode(language) {
  const selectedCountryCode = language.toUpperCase();
  var selectedCountry = null;
	for (let countryCode in countries) {
    if (selectedCountryCode == countryCode) {
      selectedCountry = countries[countryCode];
      return countries[countryCode].callingCode;
    }
  }
  return null;
}