import React from 'react'
import { View, Text, TextInput, Alert } from 'react-native'
import SetWrapper from '../../auth-signup/common/wrappers/SetWrapper'
import { Actions } from 'react-native-router-flux'
import moduleStyles from '../../auth-signup/common/styles'
import { em } from '~/common/constants'
import { Spacer, Button } from '~/common/components'

export default class ScreenView extends React.Component {
  state = {
    displayName: this.props.displayName,
    adjust: {
      fixedBottom: 40*em
    }    
  };

  onGoBack = () => Actions['signup_set_confirm_code']();

  onGoNext = () => {
    const { displayName } = this.state;
    const { _t } = this.props.appActions;
    
    if(displayName)
      Actions['signup_set_email']({ displayName });
    else
      Alert.alert(
        _t('Check your info.'),
        _t('Please input your display name.'),
        [
          {text: _t('OK'), onPress: () => console.log('==== clicked Ok.')},
        ],
        {cancelable: true},
      );
  };

  adjustOnFocus = () => this.setState({ adjust: {fixedBottom: 320*em} });

  adjustOnBlur = () => this.setState({ adjust: {fixedBottom: 40*em} });

  render() {
    const { _t } = this.props.appActions;
    return (
      <SetWrapper visible={true}>
        <Text style={moduleStyles.text.title}>
          {_t('Hello, what is your name?')}
        </Text>
        <Spacer size={80} />
        <TextInput placeholder={_t('First Name')} placeholderTextColor='#fff'
          style={moduleStyles.input.setField}
          autoCapitalize='none' autoCorrect={false}          
          value={this.state.displayName}
          onChangeText={displayName => this.setState({ displayName })}
          onFocus={this.adjustOnFocus} onBlur={this.adjustOnBlur}
        />
        <View style={[moduleStyles.bottomActionBar, {bottom: this.state.adjust.fixedBottom}]}>
          <Button 
            onPress={this.onGoNext}
            caption={_t('Next')}
          />
        </View>
      </SetWrapper>
    )
  }
}
