import React from 'react'
import { View, Text, TextInput } from 'react-native'
import SetWrapper from '../../common/wrappers/SetWrapper'
import { Actions } from 'react-native-router-flux'
import moduleStyles from '../../common/styles'
import { em } from '~/common/constants'
import { Spacer, Button } from '~/common/components'

export default class ScreenView extends React.Component {
  state = {
    email: '',
    adjust: {
      fixedBottom: 40*em
    }    
  }

  render() {
    const { _t } = this.props.appActions
    const { signup } = this.props

    return (
      <SetWrapper onGoBack={this.onGoBack} onPass={this.onPass} passText={_t('Pass')}>
        <Text style={moduleStyles.text.title}>
          {_t(`Delighted ${signup.name}, what is your email?`)}
        </Text>
        <Spacer size={80} />
        <TextInput placeholder={_t('Email')} placeholderTextColor='#fff'
          style={moduleStyles.input.setField}
          autoCapitalize='none' autoCorrect={false}          
          value={this.state.name}
          onChangeText={email => this.setState({...this.state, email})}
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

  onGoBack = () => {
    Actions['signup_set_name']()
  }

  onGoNext = () => {
    this.props.signupActions.setEmail(this.state.email)
    Actions['signup_set_birthday']()
  }

  onPass = () => {
    Actions['signup_set_birthday']()
  }

  adjustOnFocus = () => {
    this.setState({...this.state,
      adjust: {fixedBottom: 320*em}
    })
  }

  adjustOnBlur = () => {
    this.setState({...this.state,
      adjust: {fixedBottom: 40*em}
    })
  }

}
