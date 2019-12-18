import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Toast } from 'native-base';
import { Actions } from 'react-native-router-flux';
import LogoView from '~/common/components/LogoView';
import { Spacer, Button } from '~/common/components';
import commonStyles from '~/common/styles';
import PhoneNumberInput from '~/common/components/PhoneNumberInput';
import { facebookService } from '~/common/lib/facebook';
import { W, H, em, colors } from '~/common/constants';
import FirstWrapper from '../../common/wrappers/FirstWrapper';

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
    const { auth } = this.props;
    const { isFetching, isFacebook } = auth;
    const isLoggingIn = (isFetching && !isFacebook);
    const isLoggingInWithFacebook = (isFetching && isFacebook);

    return (
      <FirstWrapper>
        <View style={{
          flex: 1,
          alignItems: 'center', justifyContent: 'center',
          paddingHorizontal: 20*em
        }}>
          <View style={{width: '100%'}}>
            <Spacer size={this.state.adjust.mostTop} />
            <LogoView />
            <Spacer size={50*em} />
            <Text style={[commonStyles.text.titleWhite, {fontSize: 26*em, textAlign: 'center'}]}>
              {_t("Connect yourself")}
            </Text>
            <Spacer size={10*em} />
            <PhoneNumberInput
              defaultCountry={this.props.app.language.toUpperCase()}
              placeholder={_t('Mobile number')} 
              phoneNumber={phoneNumber}
              onChangeCountry={this.onChangeCountry}
              onChangePhoneNumber={(phoneNumber) => this.setState({...this.state, phoneNumber})} 
              onFocus={() => this.adjustOnTextFocus()}
              onBlur={() => this.adjustOnTextBlur()}
            />
            <Spacer size={20*em} />
            <Button
              onPress={this.onLogin}
              caption={_t('Next')}
              loading={isLoggingIn}
              disabled={isLoggingIn}
            />
            {/* {auth.isFetching
              ? <ActivityIndicator color={'#00a9f2'} />
              : <Button
                  onPress={this.onLogin}
                  caption={_t('Next')}
                  loading={auth.isFetching}
                  disabled={auth.isFetching}
                />
            }*/}
            <Spacer size={20*em} />
            <Button onPress={this.onFacebookLogin} 
              caption={_t('Continue with facebook')} 
              icon={require('~/common/assets/images/facebook.png')}
              textColor='#fff'
              bgGradientStart='#48bff3'
              bgGradientEnd='#00a9f2'
              loading={isLoggingInWithFacebook}
              disabled={isLoggingInWithFacebook}
            />
            <Spacer size={30*em} />
            <TouchableOpacity
              style={{width: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}
              onPress={() => this.goSignup()}
            >
              <Text style={[commonStyles.text.defaultWhite, {fontSize: 14*em}]}>
                {_t("No account?")}
              </Text>
              <Text style={[commonStyles.text.defaultWhite, {fontSize: 14*em, fontWeight: 'bold'}]}>
                {` ${_t('Register yourself')}`}              
              </Text>
            </TouchableOpacity>
            <Spacer size={60*em} />
          </View>
        </View>
      </FirstWrapper>
    )
  }

  showToast() {
    const { _t } = this.props.appActions
    const { statusMessage } = this.props.auth
    const { clearMessage } = this.props.authActions

    if (statusMessage != '') {
      Toast.show({
        type: 'danger',
        text: _t(statusMessage),
        position: 'top',
      })
      clearMessage()
    }
  }

  onLogin = () => {
    const { countryCode, phoneNumber } = this.state
    this.props.authActions.tryLogin(countryCode, phoneNumber)
  }

  onFacebookLogin = () => {
    const _this = this;
    this.props.authActions.tryLoginWithFacebook();
    facebookService.loginWithLoginManager((res) => {
      if (res.action === 'loggedin') _this.loadProfileFromFacebook();
      if (res.action === 'cancel') _this.onCancelFacebookLogin();
      if (res.action === 'failed') _this.onFailedFacebookLogin();
    });
  }

  async loadProfileFromFacebook() {
    try {
      const profile = await facebookService.fetchProfile((profile, error) => {
        if (profile) console.log('====== onFacebookLoing: profile: ', profile);
        if (error) console.log('====== onFacebookLogging: error: ', error);
      });
      console.log('==== loadProfileFromFacebook: profile: ', profile);
      this.onSuccessFacebookLogin(profile);
    } catch (error) {
      console.log('===== error: ', error);
      this.onFailedFacebookLogin('Network failed. Please try again.');
    }
  }

  onSuccessFacebookLogin = (profile) => {
    this.props.authActions.loginWithFacebook(profile.id);
  }

  onCancelFacebookLogin = () => {
    this.props.authActions.loginCanceled();
  }

  onFailedFacebookLogin = (error) => {
    console.log('===== error: ', error);
    this.props.appActions.setGlobalNotification({message: error.message, type: 'danger', duration: 6000});
    this.props.authActions.loginFailed(error);
  }

  goSignup = () => {
    Actions['signup_first']()
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
