import React from 'react';
import { TouchableOpacity, Text, Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import FirstWrapper from '~/modules/auth-login/common/wrappers/FirstWrapper';
import {
  Button,
  Spacer,
  PhoneNumberInput
} from '~/common/components';
import { PhoneAuth, FacebookAuth } from '~/common/services/rn-firebase/auth';
import { checkIfUserExistsByPhoneNumber } from '~/common/services/rn-firebase/database';
import { em, colors } from '~/common/constants';
import commonStyles from '~/common/styles';
import { convertLanguage2CallingCode } from '~/common/utils/country';
import SetConfirmCode from '~/modules/auth-login/confirm-code/ViewContainer';

const { loginWithPhone, confirmWithPhone } = PhoneAuth;
const { loginWithFacebook } = FacebookAuth;
const FACEBOOK_IMAGE = require('~/common/assets/images/facebook.png');

export default class SignupView extends React.Component {
  state = {
    phoneNumber: this.props.phoneNumber || '',
    countryCode: convertLanguage2CallingCode(this.props.app.language) || '33',
    facebookSigning: false,
    phoneSigning: false,
    showConfirmCodeModal: false,
    adjust: {
      mostTop: 180*em
    }
  };

  onSignup = async () => {
    if (this.isInvalid()) return;
    const { _t } = this.props.appActions;
    const { countryCode, phoneNumber } = this.state;
    const fullPhoneNumber = `+${countryCode}${phoneNumber}`;

    this.setState({phoneSigning: true});
    const res = await loginWithPhone(fullPhoneNumber);
    const isExistUser = await checkIfUserExistsByPhoneNumber(fullPhoneNumber);
    if (isExistUser) {
      this.setState({phoneLogining: false}, () => {
        Alert.alert(
          _t('Failed to register.'),
          _t('Your phone number already was registered. Would you login now?'),
          [
            {text: _t('Cancel'), onPress: () => console.log('Cancel Pressed')},
            {text: _t('OK'), onPress: () => this.goLogin()},
          ],
          {cancelable: true},
        );  
      });
    } else {
      this.setState({phoneSigning: false});
      if (res.confirmation) {
        this.setState({
          confirmation: res.confirmation,
          showConfirmCodeModal: true
        });
      } else {
        Alert.alert(
          _t('Failed to sign up'),
          _t(res.error),
          [
            {text: _t('OK'), onPress: () => console.log('OK Pressed')},
          ],
          {cancelable: false},
        );
        this.setState({phoneSigning: false});
      }
    }
  };

  isInvalid = () => {
    const { phoneNumber } = this.state
    if (phoneNumber == '') return true

    return false
  };

  onFacebookSignup = async () => {
    const { authActions } = this.props;
    this.setState({facebookSigning: true});
    const res = await loginWithFacebook();
    this.setState({facebookSigning: false});
    if (res.credential) {
      authActions.loginSuccessWithSocial(res.credential, auth);
    } else {
      authActions.loginFailed(res.error);
      Alert(res.error);
    }
  };

  goLogin = () => Actions['login']({phoneNumber: this.state.phoneNumber});

  onChangeCountry = (country, code) => {
    this.setState({countryCode: code}, () => {
      this.props.appActions.setLanguage(country.toLowerCase());
    });
  };

  onCloseConfirmCodeModal = () => {
    this.setState({showConfirmCodeModal: false});
  };

  onConfirmedCode = (res) => {
    if (!res.error) {
      const credentail = {
        additionalUserInfo: {},
        user: res.user
      };
      this.props.authActions.loginSuccess(credentail);
    }
    this.onCloseConfirmCodeModal();
  };

  render() {
    const {
      phoneNumber,
      phoneSigning,
      facebookSigning,
      showConfirmCodeModal,
      confirmation
    } = this.state;
    const { _t } = this.props.appActions;

    return (
      <FirstWrapper>
        <React.Fragment>
          <Text style={[commonStyles.text.titleWhite, {fontSize: 26*em, textAlign: 'center'}]}>
            {_t("Register yourself")}
          </Text>
          <Spacer size={20*em} />
          <PhoneNumberInput
            defaultCountry={this.props.app.language.toUpperCase()}
            placeholder={_t('Mobile number')}
            phoneNumber={phoneNumber}
            onChangeCountry={this.onChangeCountry}
            onChangePhoneNumber={(phoneNumber) => this.setState({phoneNumber})}
          />
          <Spacer size={20*em} />
          <Button
            onPress={this.onSignup}
            caption={_t('Next')}
            loading={phoneSigning}
            disabled={phoneSigning}
          />
          <Text style={[commonStyles.text.defaultWhite, {textAlign: 'center', fontSize: 12*em}]}>
            {_t("We will send you an SMS to check your number")}
          </Text>
          <Spacer size={10*em} />
          <Text style={[commonStyles.text.defaultWhite, {textAlign: 'center'}]}>
            {_t("or")}
          </Text>
          <Spacer size={10*em} />
          <Button
            onPress={this.onFacebookSignup} 
            caption={_t('Continue with facebook')} 
            icon={FACEBOOK_IMAGE}
            textColor='#fff'
            bgGradientStart='#48bff3'
            bgGradientEnd='#00a9f2'
            loading={facebookSigning}
            disabled={facebookSigning}
          />
          <Spacer size={10*em} />
          <TouchableOpacity
            style={{width: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}
            onPress={this.goLogin}
          >
            <Text style={[commonStyles.text.defaultWhite, {fontSize: 14*em}]}>
              {_t("Already have an account?")}
            </Text>
            <Text style={[commonStyles.text.defaultWhite, {fontSize: 14*em, fontWeight: 'bold'}]}>
              {` ${_t('Connect yourself')}`}
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
