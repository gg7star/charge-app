import React from 'react'
import { View, Text, TextInput } from 'react-native'
import SetWrapper from '../../common/wrappers/SetWrapper'
import { Actions } from 'react-native-router-flux'
import moduleStyles from '../../common/styles'
import { em } from '~/common/constants'
import { Spacer, Button } from '~/common/components'

export default class ScreenView extends React.Component {
  state = {
    email: this.props.email,
    adjust: {
      fixedBottom: 40*em
    }    
  };


  onGoBack = () => Actions['signup_set_name']({displayName: this.props.displayName});

  onGoNext = () => Actions['signup_set_birthday']({
    displayName: this.props.displayName, email: this.state.email
  });

  onPass = () => Actions['signup_set_birthday']({ displayName: this.props.displayName });

  adjustOnFocus = () => this.setState({ adjust: {fixedBottom: 320*em}});

  adjustOnBlur = () => this.setState({ adjust: {fixedBottom: 40*em} });

  render() {
    const { _t } = this.props.appActions;
    const { displayName } = this.props;

    return (
      <SetWrapper
        onGoBack={this.onGoBack}
        onPass={this.onPass}
        passText={_t('Pass')}
      >
        <Text style={moduleStyles.text.title}>
          {`${_t('Hello')} ${displayName}, ${_t('what is your email?')}`}
        </Text>
        <Spacer size={80} />
        <TextInput placeholder={_t('Email')} placeholderTextColor='#fff'
          style={moduleStyles.input.setField}
          autoCapitalize='none' autoCorrect={false}          
          value={this.state.email}
          onChangeText={email => this.setState({ email })}
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
