import React, {Component} from 'react';
import { StyleSheet,View, Platform } from 'react-native';
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
// import { rentSuccess, rentFailure } from '~/actions/rentActions';
import MAP_MODAL from '~/common/constants/map';

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
    // mapActions.initMap();

    // Check permissions
    const cameraPermission  = Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
    const cameraStatus = await request(cameraPermission);
    // Onsignal
    OneSignal.init(onesignalConfig.appId);
    OneSignal.inFocusDisplaying(2);
    OneSignal.addEventListener('received', (notification) => this.onReceived(this, notification));
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', loginActions.setOnesignalDevice);
    OneSignal.addEventListener('inAppMessageClicked', this.onInAppClicked);

    // Fcm
    const fcmToken = await createFcmToken();
    const notificationListiner = await startReceiveFcm(
      profileActions.addNotification
    );
    loginActions.setFcmToken(fcmToken);

    mapActions.loadPlacesOnMap();
    mapActions.getAllStations();
    // Setup auto-refresh to get all stations
    this.getAllStations();
  }

  getAllStations = () => {
    const _this = this;
    setTimeout(() => {
      _this.props.mapActions.getAllStations();
      _this.getAllStations();
    }, 3000000)
  }

  onReceived = (_this, notification) => {
    console.log("==== Notification received: ", notification, _this);
    this.props.profileActions.addNotification(notification);
    const { additionalData } = notification.payload;
    console.log('=== additionalData: ', additionalData);
    if (additionalData) {
      const notificationData = additionalData.p2p_notification ? additionalData.p2p_notification : additionalData;
      console.log('=== notificationData: ', notificationData);
      const { type } = notificationData;
      switch(type) {
        case NONO_NOTIFICATION_TYPES.RENT_BATTERY:
          console.log('==== received rent battery response: message: ', notificationData.data);
          _this.onRentSuccess({...notificationData.data});
          break;
        case NONO_NOTIFICATION_TYPES.FAILED_RENT_BATTERY:
          console.log('==== received failed to rent battery response: message: ', notificationData.data);
          _this.onRentFailure({error: notificationData.data.msg});
          break;
        case NONO_NOTIFICATION_TYPES.RETURNED_BATTERY:
          console.log('==== received to return battery: message: ', notificationData.data);
          _this.onReturnSuccess({...notificationData.data});
          break;
        default:
          break;
      }
    }
  }

  onOpened = (openResult) => {
    console.log('==== onOpened: this: ', this);
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
    // Handle notification
    this.onReceived(this, openResult.notification);
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
  };

  onRentSuccess = (data) => {
    const { auth, rentActions, mapActions } = this.props;
    rentActions.rentSuccess(data, auth);
    // mapActions.setActiveModal(MAP_MODAL.RENT);
    // Actions['map_first']();
    // Actions['map_first']({initialModal: MAP_MODAL.RENT});
  };

  onRentFailure = (error) => {
    const { auth, rentActions } = this.props;
    rentActions.rentFailure(error);
  };

  onReturnSuccess = (data) => {
    const { auth, rentActions } = this.props;
    var returnedData = {
      ...data,
      placeOfDeposit: data.stationNo
    }
    rentActions.returnedButtery(returnedData, auth);
    // Actions['admob']({adMode: 'reward'});
  };

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
