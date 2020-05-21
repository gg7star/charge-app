import React from 'react';
import { View, Text } from 'react-native';
import { Toast } from 'native-base';
import SetWrapper from '~/modules/auth-signup/common/wrappers/SetWrapper';
import { Actions } from 'react-native-router-flux';
import moduleStyles from '~/modules/auth-signup/common/styles';
import { em } from '~/common/constants';
import { Spacer, Button, ConfirmCodeInput } from '~/common/components';

export default class SetConfirmCodeView extends React.Component {
  state = {
    confirmCode: '',
    isConfirming: false,
    adjust: { fixedBottom: 40*em }
  };

  onGoBack = () => Actions['signup_first']();

  setConfirmCode = (confirmCode) => this.setState({ confirmCode });

  onGoNext = async () => {
    const { confirmation, isSignup, appActions, authActions } = this.props;
    const { _t } = appActions;
    const { confirmCode } = this.state ;

    if (confirmCode == '') return;
    this.setState({isConfirming: true});
    try {
      const res = await confirmation.confirm(confirmCode);
      console.log('==== onGoNext: res: ', res);
      authActions.loginSuccess(res);
      if (isSignup) Actions['signup_set_name']();
      else Actions['home']();
    } catch (e) {
      console.log('===== failed to confirm code: ', e);
      Alert.alert(
        _t('Failed to confirm your code.'),
        _t('Input valid correct confirm code.'),
        [
          { text: _t('OK'), onPress: () => console.log("OK Pressed") }
        ],
        { cancelable: true }
      );
    }
    this.setState({isConfirming: true});
  };

  render() {
    const { _t } = this.props.appActions;
    const { confirmCode, isConfirming } = this.state;
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
        <View
          style={[
            moduleStyles.bottomActionBar,
            {bottom: this.state.adjust.fixedBottom}
          ]}
        >
          <Button 
            onPress={this.onGoNext}
            caption={_t('Next')}
            loading={isConfirming}
            disabled={(confirmCode === '') && (confirmCode.length == 6)}
          />
        </View>
      </SetWrapper>
    )
  }
}
