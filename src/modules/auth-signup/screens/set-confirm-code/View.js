import React from 'react';
import { View, Text } from 'react-native';
import { Toast } from 'native-base';
import SetWrapper from '~/modules/auth-signup/common/wrappers/SetWrapper';
import { Actions } from 'react-native-router-flux';
import moduleStyles from '~/modules/auth-signup/common/styles';
import { em } from '~/common/constants';
import { Spacer, Button, ConfirmCodeInput } from '~/common/components';

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
          {_t('Enter the 6-digit code sent to')}
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
    Actions['signup_first']();
  }

  setConfirmCode = (confirmCode) => {
    this.setState({...this.state,
      confirmCode
    });
  }

  onGoNext = () => {
    const { _t } = this.props.appActions;
    const { confirmation } = this.props.signup;
    const { confirmCode } = this.state ;
    if (confirmCode == '') return;
    try {
      confirmation.confirm(confirmCode).then(() => {
        // Successful login - onAuthStateChanged is triggered
        Actions['signup_set_name']();
      }); // User entered code
    } catch (e) {
      console.error('===== failed to confirm code: ', e); // Invalid code
      Toast.show({
        type: 'danger',
        text: _t('Input valid correct confirm code.')
      });
    }
  }
}
