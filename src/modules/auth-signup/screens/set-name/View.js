import React from 'react'
import { View, Text, TextInput } from 'react-native'
import SetWrapper from '../../common/wrappers/SetWrapper'
import { Actions } from 'react-native-router-flux'
import moduleStyles from '../../common/styles'
import { em } from '~/common/constants'
import { Spacer, Button } from '~/common/components'

export default class ScreenView extends React.Component {
  state = {
    name: '',
    adjust: {
      fixedBottom: 40*em
    }    
  }

  render() {
    const { _t } = this.props.appActions
    return (
      <SetWrapper onGoBack={this.onGoBack}>
        <Text style={moduleStyles.text.title}>
          {_t('Hello, what is your name?')}
        </Text>
        <Spacer size={80} />
        <TextInput placeholder={_t('First Name')} placeholderTextColor='#fff'
          style={moduleStyles.input.setField}
          autoCapitalize='none' autoCorrect={false}          
          value={this.state.name}
          onChangeText={name => this.setState({...this.state, name})}
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
    Actions['signup_set_confirm_code']()
  }

  onGoNext = () => {
    this.props.signupActions.setName(this.state.name)
    Actions['signup_set_email']()
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
