import React, {Component} from 'react';
import {
  StyleSheet, SafeAreaView, View, StatusBar, Platform,
  AppRegistry, AsyncStorage, Alert
} from 'react-native';
import { Root, Toast } from 'native-base';
import OneSignal from 'react-native-onesignal';
import {name as appName} from '../../../app.json';
import RootRoutes from '~/routes';
import {
  createFcmToken,
  startReceiveFcm,
  saveFcmToken
} from '~/common/services/rn-firebase/message';
import Geolocation from 'react-native-geolocation-service';

const GEOLOCATION_OPTION = {
  enableHighAccuracy: true,
  timeout: 200000,
  maximumAge: 1000
};

export default class AppView extends Component {
  state = {
    fcmListener: null,
    fcmToken: null
  };

  async componentDidMount() {
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

    // Onsignal
    OneSignal.init("b4e6bc9d-3ebb-4ff5-818e-91a76b5239b7");
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);

    // Fcm
    // const fcmToken = await createFcmToken();
    // loginActions.setFcmToken(fcmToken);

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
      GEOLOCATION_OPTION
    );

    this.props.mapActions.loadPlacesOnMap();
  }

  async componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);

    const { auth } = this.props;
    (auth && auth.fcm && auth.fcm.fcmListener) && auth.fcm.fcmListener();

    Geolocation.stopObserving();
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
    // console.log("==== position: ", position);
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
    // console.log('===== location error: ', error.message);
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

  handleDetectDirection = ({distance, duration}) => {
    this.props.mapActions.setDirection({distance, duration});
  }


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
      appActions.setGlobalNotification({message: null, type: ''});
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
