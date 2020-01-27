import React, {Component} from 'react';
import {
  StyleSheet, SafeAreaView, View, StatusBar, Platform,
  AppRegistry, AsyncStorage, Alert,
  PermissionsAndroid,
  ToastAndroid,
} from 'react-native';
import {PERMISSIONS, request} from 'react-native-permissions';
import { Root, Toast } from 'native-base';
import OneSignal from 'react-native-onesignal';
import Geolocation from 'react-native-geolocation-service';
import { Actions } from 'react-native-router-flux';
import onesignalConfig from '~/common/config/onesignal';
import RootRoutes from '~/routes';
import {
  createFcmToken,
  startReceiveFcm,
  saveFcmToken
} from '~/common/services/rn-firebase/message';
import LocalStorage from '~/store/localStorage';
import STORAGE from '~/common/constants/storage';
import { SplashView } from '~/common/components';

const GEOLOCATION_OPTION = {
  enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, distanceFilter: 50, forceRequestLocation: true
};
const GEOLOCATION_WATCH_OPTION = {
  enableHighAccuracy: true, distanceFilter: 0, interval: 5000, fastestInterval: 2000
}

export default class AppView extends Component {
  state = {
    fcmListener: null,
    fcmToken: null,
    loaded: false
  };

  componentDidMount() {
    
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
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);

    const { auth } = this.props;
    (auth && auth.fcm && auth.fcm.fcmListener) && auth.fcm.fcmListener();

    Geolocation.stopObserving();
  }
  
  async initialize() {
    const {
      app,
      auth,
      signup,
      appActions,
      loginActions,
      signupActions,
      mapActions
    } = this.props;

    appActions.setLanguage(app.language || 'fr');
    appActions.setGlobalNotification({message: null, type: ''});
    // signupActions.initSignup();
    // loginActions.initLogin();
    mapActions.initMap();

    // Check permissions
    const cameraStatus = await request(PERMISSIONS.IOS.CAMERA);
    // Onsignal
    OneSignal.init(onesignalConfig.key);
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);

    // Fcm
    const fcmToken = await createFcmToken();
    loginActions.setFcmToken(fcmToken);

    // Map
    // await this.initGeoLocation();

    mapActions.loadPlacesOnMap();
    mapActions.getAllStations();
    if (auth.isAuthenticated) {
      Actions.map();
    }
  }

  async initGeoLocation() {
    const hasPermission = await this.hasLocationPermission();
    if(hasPermission) {
      Geolocation.requestAuthorization();
      // Map
      const _this = this;
      // Get current location
      Geolocation.getCurrentPosition(
        (position) => { _this.handleGetCurrentLocation(position) },
        (error) => { _this.handleCurrentLocationError(error) },
        GEOLOCATION_OPTION
      );

      Geolocation.watchPosition(
        (position) => { _this.handleGetCurrentLocation(position) },
        (error) => { _this.handleCurrentLocationError(error) },
        GEOLOCATION_WATCH_OPTION
      );
    }
  }

  hasLocationPermission = async () => {
    if (Platform.OS === 'ios' ||
        (Platform.OS === 'android' && Platform.Version < 23)) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (hasPermission) return true;

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show('Location permission revoked by user.', ToastAndroid.LONG);
    }

    return false;
  }

  onReceived(notification) {
    console.log("Notification received: ", notification);
  }

  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }

  onIds(device) {
    console.log('Device info: ', device);
  }

  setFcmListiner = (fcmListener) => {
    console.log('===== fcmListener: ', fcmListener);
    this.setState({fcmListener});
  }


  handleGetCurrentLocation = (position) => {
    console.log("==== handleGetCurrentLocation: ", position);
    const { mapActions } = this.props;
    const newLocation = {
      name: "My location",
      coordinate: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
      }
    };
    mapActions.changedCurrentLocation(newLocation);
    mapActions.searchPlaces('', newLocation, null);
  }

  handleCurrentLocationError = (error) => {
    console.log('===== location error: ', error);
    if (this.props.map.currentLocation) {
      // Set previous location.
      const prevCordinate = this.props.map.currentLocation.coordinate;
      this.props.mapActions.changedCurrentLocation({
        name: "My location",
        coordinate: {
          latitude: prevCordinate.latitude,
          longitude: prevCordinate.longitude,
          error: error.message,
        }
      });
    }
  }

  showToast() {
    const { _t } = this.props.appActions
    const { notification } = this.state
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
      appActions.setGlobalNotification({message: null, type: ''});
    }
  }
  
  render() {
    const { loaded } = this.state;
    console.log('===== state: loaded: ', loaded);
    if (loaded) {
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
