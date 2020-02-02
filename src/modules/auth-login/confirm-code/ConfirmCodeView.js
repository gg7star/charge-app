import React from 'react';
import { View, Text, Alert } from 'react-native';
import Modal from "react-native-modal";
import SetWrapper from '~/modules/auth-signup/common/wrappers/SetWrapper';
import moduleStyles from '~/modules/auth-signup/common/styles';
import { W, H, em } from '~/common/constants';
import { Spacer, Button, ConfirmCodeInput } from '~/common/components';

export default class ConfirmCodeView extends React.Component {
  state = {
    confirmCode: '',
    isConfirming: false,
    adjust: { fixedBottom: 40*em }
  };

  onGoBack = () => this.props.onClose();

  changeConfirmCode = (confirmCode) => this.setState({ confirmCode });

  onGoNext = async () => {
    const { confirmation, confirmFunc, onConfirmed, appActions } = this.props;
    const { _t } = appActions;
    const { confirmCode } = this.state ;

    this.setState({isConfirming: true});
    try {
      const res = await confirmFunc(confirmation, confirmCode);
      this.setState({isConfirming: false}, () => onConfirmed(res));
    } catch (e) {
      console.log('===== failed to confirm code: ', e);
      Alert.alert(
        _t('Failed to confirm your code.'),
        _t('Input valid correct confirm code.'),
      );
      this.setState({isConfirming: false});
    }
  };

  render() {
    const { _t } = this.props.appActions;
    const { isConfirming } = this.state;
    const { isVisible } = this.props;
    return (
      <Modal
        isVisible={isVisible}
        animationIn={'slideInRight'}
        deviceWidth={W}
        deviceHeight={H}
        avoidKeyboard={true}
        hasBackdrop
        backdropColor='white'
        coverScreen
        style={{margin: 0}}
      >
        <SetWrapper onGoBack={this.onGoBack}>
          <Text style={moduleStyles.text.title}>
            {_t('Phone number validation')}
          </Text>
          <Spacer size={10} />
          <Text style={moduleStyles.text.desc}>
            {_t('Enter the 6-digit code sent to')}
          </Text>
          <Spacer size={30} />
          <ConfirmCodeInput onFulfill={this.changeConfirmCode} />
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
            />
          </View>
        </SetWrapper>
      </Modal>
    )
  }
}
