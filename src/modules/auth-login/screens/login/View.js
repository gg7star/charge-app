import React from 'react';
import { TouchableOpacity, View, Text, Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Modal from "react-native-modal";
import { Spacer, Button } from '~/common/components';
import commonStyles from '~/common/styles';
import PhoneNumberInput from '~/common/components/PhoneNumberInput';
import { PhoneAuth, FacebookAuth } from '~/common/services/rn-firebase/auth';
import { W, H, em } from '~/common/constants';
import FirstWrapper from '../../common/wrappers/FirstWrapper';
import { convertLanguage2CallingCode } from '~/common/utils/country';
import SetConfirmCode from '../../confirm-code/ViewContainer';


const { loginWithPhone, confirmWithPhone } = PhoneAuth;
const { loginWithFacebook } = FacebookAuth;
const FACEBOOK_IMAGE = require('~/common/assets/images/facebook.png');


export default class ScreenView extends React.Component {
  state = {
    phoneNumber: '',
    countryCode: convertLanguage2CallingCode(this.props.app.language) || '33',
    facebookLogining: false,
    phoneLogining: false,
    showConfirmCodeModal: false
  }

  onLogin = async () => {
    const { _t } = this.props.appActions;
    const { countryCode, phoneNumber } = this.state;
    this.setState({phoneLogining: true});
    const res = await loginWithPhone(`+${countryCode}${phoneNumber}`);
    this.setState({phoneLogining: false});
    if (res.confirmation) {
      this.setState({
        confirmation: res.confirmation,
        showConfirmCodeModal: true
      });
    } else {
      Alert.alert(
        _t('Failed to login'),
        _t(res.error),
        [
          {text: _t('OK'), onPress: () => console.log('OK Pressed')},
        ],
        {cancelable: false},
      );
      this.setState({phoneLogining: false});
    }
  }

  onFacebookLogin = async () => {
    const { authActions } = this.props;
    this.setState({facebookLogining: true});
    const res = await loginWithFacebook();
    this.setState({facebookLogining: false});
    if (res.credential) {
      authActions.loginSuccess(res.credential);
      Actions['home'];
    } else {
      authActions.loginFailed(res.error);
      Alert(res.error);
    }
  }

  goSignup = () => {
    Actions['signup_first']();
  }

  onChangeCountry = (country, code) => {
    this.setState({countryCode: code}, () => {
      this.props.appActions.setLanguage(country.toLowerCase());
    });
  }

  onCloseConfirmCodeModal = () => {
    this.setState({showConfirmCodeModal: false});
  }

  onConfirmedCode = (res) => {
    console.log('===== res: ', res);
    if (!res.error) this.props.authActions.loginSuccess(res.credentail);
    this.onCloseConfirmCodeModal();
  }

  renderConfirmCodeModal = () => {
    const { showConfirmCodeModal, confirmation } = this.state;
    return (
      <Modal
        isVisible={showConfirmCodeModal}
        animationIn={'slideInRight'}
        deviceWidth={W}
        deviceHeight={H}
        avoidKeyboard={true}
        hasBackdrop
        backdropColor='white'
        coverScreen
        style={{margin: 0}}
      >
        <SetConfirmCode
          confirmation={confirmation}
          confirmFunc={confirmWithPhone}
          onClose={this.onCloseConfirmCodeModal}
          onConfirmed={this.onConfirmedCode} 
        />
      </Modal>
    )
  };

  render() {
    const {
      phoneNumber,
      phoneLogining,
      facebookLogining,
      showConfirmCodeModal,
      confirmation
    } = this.state;
    const { _t } = this.props.appActions;
    const { auth } = this.props;

    return (
      <FirstWrapper>
        <React.Fragment>
          <Text
            style={[
              commonStyles.text.titleWhite,
              {fontSize: 26*em, textAlign: 'center'}
            ]}
          >
            {_t("Connect yourself")}
          </Text>
          <Spacer size={10*em} />
          <PhoneNumberInput
            defaultCountry={this.props.app.language.toUpperCase()}
            placeholder={_t('Mobile number')} 
            phoneNumber={phoneNumber}
            onChangeCountry={this.onChangeCountry}
            onChangePhoneNumber={(phoneNumber) => this.setState({phoneNumber})}
          />
          <Spacer size={20*em} />
          <Button
            onPress={this.onLogin}
            caption={_t('Next')}
            loading={phoneLogining}
            disabled={phoneLogining}
          />
          <Text
            style={[
              commonStyles.text.defaultWhite,
              {textAlign: 'center', fontSize: 12*em}
            ]}
          >
            {_t("We will send you an SMS to check your number")}
          </Text>
          <Spacer size={10*em} />
          <Text style={[commonStyles.text.defaultWhite, {textAlign: 'center'}]}>
            {_t("or")}
          </Text>
          <Spacer size={10*em} />
          <Button onPress={this.onFacebookLogin} 
            caption={_t('Continue with facebook')} 
            icon={FACEBOOK_IMAGE}
            textColor='#fff'
            bgGradientStart='#48bff3'
            bgGradientEnd='#00a9f2'
            loading={facebookLogining}
            disabled={facebookLogining}
          />
          <Spacer size={30*em} />
          <TouchableOpacity
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row'
            }}
            onPress={() => this.goSignup()}
          >
            <Text style={[commonStyles.text.defaultWhite, {fontSize: 14*em}]}>
              {_t("No account?")}
            </Text>
            <Text
              style={[
                commonStyles.text.defaultWhite,
                {fontSize: 14*em, fontWeight: 'bold'}
              ]}
            >
              {` ${_t('Register yourself')}`}              
            </Text>
          </TouchableOpacity>
          <Spacer size={60*em} />

          <SetConfirmCode
            isVisible={showConfirmCodeModal}
            confirmation={confirmation}
            confirmFunc={confirmWithPhone}
            onClose={this.onCloseConfirmCodeModal}
            onConfirmed={this.onConfirmedCode} 
          />
        </React.Fragment>
      </FirstWrapper>
    )
  }
}
