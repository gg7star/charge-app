import React from 'react';
import { View, Text,  } from 'react-native';
import SetWrapper from '../../auth-signup/common/wrappers/SetWrapper';
import { Actions } from 'react-native-router-flux';
import moduleStyles from '../../auth-signup/common/styles';
import { em } from '~/common/constants';
import { Spacer, Button } from '~/common/components';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import { setUserInfo } from '~/common/services/rn-firebase/database';
import * as notifications from '~/common/services/onesignal/notifications';

export default class ScreenView extends React.Component {
  state = {
    birthday: new Date(),
    loading: false,
    adjust: {
      fixedBottom: 40*em
    }    
  };

  onGoBack = () => {
    const { displayName, email } = this.props;
    Actions['signup_set_email']({ displayName, email});
  }

  onFinish = async () => {
    const { birthday } = this.state;
    const { displayName, email, auth, authActions, appActions } = this.props;
    const birthday_ = moment(new Date(birthday)).format('YYYY-MM-DD');
    const { credential } = auth;
    const userInfo = { displayName, email, birthday: birthday_ };
    const { _t } = appActions;
    
    this.setState({ loading: true });
    const res = await setUserInfo({credential, userInfo});
    console.log('==== setUserInfo: res: ', res);
    this.setState({loading: false});
    if (res) {
      // Save user info
      authActions.updatedUserInfo(res);
      // Send notification
      var contents = {
        'en': `You are registered firstly with your Phone number: ${res.phoneNumber}.`,
        'fr': `Vous êtes d'abord enregistré avec votre numéro de téléphone.`
      }
      var message = {
        type: notifications.NONO_NOTIFICATION_TYPES.REGISTERED_FIRST
      };
      var otherParameters = {
        headings: {
          "en": "Welcome to Nono!",
          "fr": "Bienvenue chez Nono!"
        },
      }
      if (auth.oneSignalDevice && auth.oneSignalDevice.userId) {
        notifications.postNotification(contents, message, auth.oneSignalDevice.userId, otherParameters);
      }
      // Go to hint
      Actions['hint']();
    } else {
      Alert.alert(
        _t('Failed to save user info.'),
        _t('We can not save your info. Please try again later.'),
        [
          {text: _t('OK'), onPress: () => console.log('==== clicked Ok.')},
        ],
        {cancelable: true},
      );
    }
  }

  onPass = () => {
    this.onFinish();
  }

  render() {
    const { _t } = this.props.appActions;
    const { loading } = this.state;

    return (
      <SetWrapper
        onGoBack={this.onGoBack}
        onPass={this.onPass}
        passText={_t('Pass')}
      >
        <Text style={moduleStyles.text.title}>
          {_t('What is your date of birth?')}
        </Text>
        <Spacer size={30} />
        <DatePicker
          date={this.state.birthday}
          mode={'date'}
          textColor={'#ffffff'}
          onDateChange={ birthday => this.setState({ birthday }) }
          style={[moduleStyles.input.setField, {backgroundColor: 'transparent'}]}
        />
        <View style={[moduleStyles.bottomActionBar, {bottom: this.state.adjust.fixedBottom}]}>
          <Button
            onPress={this.onFinish}
            caption={_t('Finish')}
            loading={loading}
            disabled={loading}
          />
        </View>
      </SetWrapper>
    )
  }
}
