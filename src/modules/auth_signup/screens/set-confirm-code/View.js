import React from 'react'
import { View, Text } from 'react-native'
import SetWrapper from '../../common/wrappers/SetWrapper'
import { Actions } from 'react-native-router-flux'
import ConfirmCodeInput from '../../common/components/ConfirmCodeInput'
import moduleStyles from '../../common/styles'
import { em } from '~/common/constants'
import { Spacer, Button } from '~/common/components'
import { Toast } from 'native-base'

export default class ScreenView extends React.Component {
  state = {
    confirmCode: '',
    adjust: {
      fixedBottom: 40*em
    }    
  }

  render() {
    const { _t } = this.props.appActions
    return (
      <SetWrapper onGoBack={this.onGoBack}>
        <Text style={moduleStyles.text.title}>
          {_t('Phone number validation')}
        </Text>
        <Spacer size={10} />
        <Text style={moduleStyles.text.desc}>
          {_t('Enter the 4-digit code sent to')}
        </Text>
        <Spacer size={30} />
        <ConfirmCodeInput onFulfill={this.setConfirmCode} />
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
    Actions['signup_first']()
  }

  setConfirmCode = (confirmCode) => {
    this.setState({...this.state,
      confirmCode
    })
  }

  onGoNext = () => {
    const { _t } = this.props.appActions
    if (this.isInvalid()) {
      Toast.show({
        type: 'danger',
        text: _t('Input valid correct confirm code.')
      })
      return 
    }

    this.props.signupActions.setConfirmCode(this.state.confirmCode)
    Actions['signup_set_name']()
  }

  isInvalid = () => {
    const { confirmCode } = this.state
    if (confirmCode == '') return true
    if (confirmCode != this.props.signup.confirmCode) return true

    return false
  }

}
