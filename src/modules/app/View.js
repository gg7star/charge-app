import React, {Component} from 'react';
import { StyleSheet,View } from 'react-native';
import {PERMISSIONS, request} from 'react-native-permissions';
import { Root, Toast } from 'native-base';
import OneSignal from 'react-native-onesignal';
import { Actions } from 'react-native-router-flux';
import onesignalConfig from '~/common/config/onesignal';
import RootRoutes from '~/routes';
import {
  createFcmToken,
  startReceiveFcm,
  saveFcmToken
} from '~/common/services/rn-firebase/message';
import { SplashView } from '~/common/components';
import { NONO_NOTIFICATION_TYPES } from '~/common/services/onesignal/notifications';
import { rentSuccess } from '~/actions/rentActions';

export default class AppView extends Component {
  state = {
    fcmListener: null,
    fcmToken: null,
    loaded: false,
  };

  componentDidMount() {
    _app = this;
  }
  
  async UNSAFE_componentWillReceiveProps(nextProps) {
    const { app } = nextProps;
    const { loaded } = this.state;
    if (app.loaded && !loaded) {
      const _this = this;
      this.setState({loaded: true}, () => {
        _this.initialize();
      });
    }
  }

  async componentWillUnmount() {
    const { auth, loginActions, profileActions } = this.props;
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', loginActions.setOnesignalDevice);
    OneSignal.removeEventListener('inAppMessageClicked', this.onInAppClicked);
    
    (auth && auth.fcm && auth.fcm.fcmListener) && auth.fcm.fcmListener();

    // Geolocation.stopObserving();
  }
  
  async initialize() {
    const {
      app,
      auth,
      signup,
      appActions,
      loginActions,
      mapActions,
      profileActions
    } = this.props;

    appActions.setLanguage(app.language || 'fr');
    appActions.setGlobalNotification({message: null, type: ''});
    mapActions.initMap();

    // Check permissions
    const cameraStatus = await request(PERMISSIONS.IOS.CAMERA);
    // Onsignal
    OneSignal.init(onesignalConfig.appId);
    OneSignal.inFocusDisplaying(2);
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', loginActions.setOnesignalDevice);
    OneSignal.addEventListener('inAppMessageClicked', this.onInAppClicked);

    // Fcm
    const fcmToken = await createFcmToken();
    const notificationListiner = await startReceiveFcm(
      profileActions.addNotification
    );
    loginActions.setFcmToken(fcmToken);

    // Map
    // await this.initGeoLocation();

    mapActions.loadPlacesOnMap();
    mapActions.getAllStations();
    // if (auth.isAuthenticated && auth.credential && auth.credential.user) {
    //   Actions['home'];
    // }
  }

  onReceived = (notification) => {
    console.log("==== Notification received: ", notification);
    console.log('==== this: ', this);
    this.props.profileActions.addNotification(notification);
    const { additionalData } = notification;
    if (additionalData) {
      const { p2p_notification } = additionalData;
      if (p2p_notification.type === NONO_NOTIFICATION_TYPES.RENT_BATTERY) {
        console.log('==== received rent battery response: message: ', p2p_notification.data);
        rentSuccess({...p2p_notification.data}, auth);
      }
    }
  }

  onOpened = (openResult) => {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  };

  onIds = (device) => {
    console.log('==== Device info: ', device);
    this.props.loginActions.setOnesignalDevice(device);
  };

  onInAppClicked = (message) => {
    console.log('===== message: ', message);
  };

  setFcmListiner = (fcmListener) => {
    console.log('===== fcmListener: ', fcmListener);
    this.setState({fcmListener});
  }

  render() {
    const { loaded } = this.state;
    if (loaded) {
      return (
        <View style={styles.safeArea}>
          <View style={styles.container}>
            <Root>
              <RootRoutes />
            </Root>
          </View>
        </View>
      );  
    } else {
      return (
        <View style={styles.safeArea}>
          <View style={styles.container}>
            <SplashView />
          </View>
        </View>
      )
    }
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
