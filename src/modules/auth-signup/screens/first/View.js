import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import FirstWrapper from '~/modules/auth-login/common/wrappers/FirstWrapper';
import { facebookService } from '~common/lib/facebook';
import {
  Button,
  LogoView,
  Spacer,
  PhoneNumberInput
} from '~/common/components';
import { em, colors } from '~/common/constants';
import commonStyles from '~/common/styles';

export default class ScreenView extends React.Component {
  state = {
    phoneNumber: '',
    countryCode: '33',
    adjust: {
      mostTop: 180*em
    }
  }

  render() {
    const { phoneNumber } = this.state
    const { _t } = this.props.appActions
    const { signup } = this.props;
    const signingUp = signup.isFetching && !signup.isSocialSigup;
    const signingUpWithFacebook = signup.isFetching && signup.isSocialSigup

    return (
      <FirstWrapper>
        <React.Fragment>
            <Text style={[commonStyles.text.titleWhite, {fontSize: 26*em, textAlign: 'center'}]}>
              {_t("Register yourself")}
            </Text>
            <Spacer size={20*em} />
            <PhoneNumberInput
              placeholder={_t('Mobile number')}
              phoneNumber={phoneNumber}
              onChangeCountry={this.onChangeCountry}
              onChangePhoneNumber={(phoneNumber) => this.setState({...this.state, phoneNumber})} 
              onFocus={this.adjustOnTextFocus}
              onBlur={this.adjustOnTextBlur}
            />
            <Spacer size={20*em} />
            <Button
              onPress={this.goNext}
              caption={_t('Next')}
              loading={signingUp}
              disabled={signingUp || signingUpWithFacebook}
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
              icon={require('~/common/assets/images/facebook.png')}
              textColor='#fff'
              bgGradientStart='#48bff3'
              bgGradientEnd='#00a9f2'
              loading={signingUpWithFacebook}
              disabled={signingUp || signingUpWithFacebook}
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
          </React.Fragment>
      </FirstWrapper>
    )
  }

  goNext = () => {
    if (this.isInvalid()) return;

    const { countryCode, phoneNumber } = this.state;
    this.props.signupActions.setPhoneNumber({countryCode, phoneNumber});
  }

  isInvalid = () => {
    const { phoneNumber } = this.state
    if (phoneNumber == '') return true

    return false
  }

  onFacebookSignup = () => {
    const _this = this;
    this.props.signupActions.tryFbSignup();
    facebookService.loginWithLoginManager((res) => {
      if (res.action === 'loggedin') _this.loadProfileFromFacebook();
      if (res.action === 'cancel') _this.onCancelFacebookSignup();
      if (res.action === 'failed') _this.onFailedFacebookSignup();
    });
  }

  async loadProfileFromFacebook() {
    try {
      const profile = await facebookService.fetchProfile((profile, error) => {
        if (profile) console.log('====== onFacebookLoing: profile: ', profile);
        if (error) console.log('====== onFacebookLogging: error: ', error);
      });
      console.log('==== loadProfileFromFacebook: profile: ', profile);
      this.onSuccessFacebookSignup(profile);
    } catch (error) {
      console.log('===== error: ', error);
      this.onFailedFacebookSignup(error);
    }
  }

  onSuccessFacebookSignup = (profile) => {
    this.props.signupActions.fbSignupSuccess(profile);
  }

  onCancelFacebookSignup = () => {
    this.props.signupActions.fbSignupCanceled();
  }

  onFailedFacebookSignup = (error) => {
    console.log('===== error: ', error);
    this.props.appActions.setGlobalNotification({message: error.message, type: 'danger', duration: 6000});
    this.props.signupActions.fbSignupFailed(error);
  }

  goLogin = () => {
    // this.props.signupActions.initSignup();
    Actions['login']();
  }

  onChangeCountry = (country, code) => {
    this.setState({countryCode: code}, () => {
      this.props.appActions.setLanguage(country.toLowerCase());
    });
  }

  adjustOnTextFocus = () => {
    // this.setState({...this.state, adjust: {mostTop: 20*em}})
  }

  adjustOnTextBlur = () => {
    // this.setState({...this.state, adjust: {mostTop: 180*em}})
  }

}
