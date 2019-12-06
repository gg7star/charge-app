import React, {Component} from 'react';
import {
  StyleSheet, SafeAreaView, View, StatusBar, Platform,
  AppRegistry, AsyncStorage, Alert
} from 'react-native';
import { Root } from 'native-base';
import RootRoutes from '~/routes';
import { Toast } from 'native-base'
import {name as appName} from '../../../app.json';
// import OneSignal from 'react-native-onesignal';
// import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
// import messaging from '@react-native-firebase/messaging';
import {attemptSignInWithPhone} from '~/common/services/rn-firebase/auth';


export default class AppView extends Component {
  state = {
    // notification: null
  };

  componentDidMount() {
    const {
      auth,
      signup,
      appActions,
      loginActions,
      signupActions
    } = this.props;
    appActions.setLanguage('fr');
    appActions.setGlobalNotification({message: null, type: ''});
    signupActions.initSignup();
    loginActions.initLogin();
    // attemptSignInWithPhone('+1 530-322-5413');
  }

  // componentWillReceiveProps(nextProps) {
  //   const { app } = nextProps;
  //   const { appActions } = this.props;
  //   console.log('===== app: ', app.globalNotification);
  //   if (app.globalNotification && app.globalNotification.message) {
  //     const { message, type, duration } = app.globalNotification;
  //     this.setState({notification: { message, type, duration }}, () => {
  //       // appActions.setGlobalNotification({message: null, type: ''});
  //     });
  //   } else {
  //     // this.setState({notification: null});
  //   }
  // }

  showToast() {
    const { _t } = this.props.appActions
    const { notification } = this.state

    // const { app } = nextProps;
    const { appActions, app } = this.props;
    if (app.globalNotification && app.globalNotification.message) {
      const { message, type, duration } = app.globalNotification;
      Toast.show({
        type: type,
        text: _t(message),
        position: 'top',
        duration: duration,
        buttonText: 'X',
        buttonTextStyle: { color: "#ffffff" },
        // buttonStyle: { backgroundColor: "#5cb85c" }
      });
      // appActions.setGlobalNotification({message: null, type: ''});
    }
  }
  
  render() {
    this.showToast();
    
    return (
      <View style={styles.safeArea}>
        <View style={styles.container}>
          <Root>
            <RootRoutes />
          </Root>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#000'
  }  
})
