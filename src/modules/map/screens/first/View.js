import React from 'react'
import { View, Platform, Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import stripe from 'tipsi-stripe';
import Geolocation from 'react-native-geolocation-service';
import {
  UnlockDialog,
  SearchDialog,
  DetailDialog,
  FinishDialog,
  FinishTopDialog,
  ReserveDialog,
  NearPlacesDialog,
  FilterDialog,
  RentDialog,
  FeedbackDialog,
} from '~/modules/map/modals';
import { W, H } from '~/common/constants';
import { Spacer } from '~/common/components';
import MapButton from '~/modules/map/common/components/MapButton';
import MapView from '~/modules/map/common/components/MapView';
import ProfileMenuDialog from '~/modules/profile/modals/menu/ProfileMenuDialogContainer';
import { returnButtery } from '~/common/services/station-gateway/gateway';
import defaultCurrentLocation from '~/common/config/locations';

const GEOLOCATION_OPTION = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 10000,
  distanceFilter: 50,
  forceRequestLocation: true
};
const GEOLOCATION_WATCH_OPTION = {
  enableHighAccuracy: false,
  distanceFilter: 0,
  interval: 5000,
  fastestInterval: 3000
}

export default class FirstScreenView extends React.Component {
  state = {
    profileOpened: false,
    activedModal: 'unlock',
    depositingButtery: false
  }

  async componentDidMount() {
    const { initialModal, profileOpened } = this.props
    var newState = {...this.state};
    if (initialModal) {
      newState = {
        ...newState,
        activedModal: initialModal
      }
    }

    if (profileOpened) {
      newState = {
        ...newState,
        profileOpened
      }
    }
    this.setState({...newState});

    await this.initGeoLocation();
    this.onClickPosition();
  }

  async componentWillUnmount() {
    Geolocation.stopObserving();
  }

  async initGeoLocation() {
    const hasPermission = await this.hasLocationPermission();
    if(hasPermission) {
      Geolocation.requestAuthorization();
      // Map
      const _this = this;
      // Get current location
      // Geolocation.getCurrentPosition(
      //   (position) => { _this.handleGetCurrentLocation(position) },
      //   (error) => { _this.handleCurrentLocationError(error) },
      //   GEOLOCATION_OPTION
      // );

      // Geolocation.watchPosition(
      //   (position) => { _this.handleGetCurrentLocation(position) },
      //   (error) => { _this.handleCurrentLocationError(error) },
      //   GEOLOCATION_WATCH_OPTION
      // );
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

  handleGetCurrentLocationFromGoogleMap = (coordinate) => {
    const { mapActions } = this.props;
    const newLocation = {
      name: "My location",
      coordinate: {
        ...coordinate,
        error: null,
      }
    };
    mapActions.changedCurrentLocation(newLocation);
    mapActions.searchPlaces('', newLocation, null);
  }

  handleGetCurrentLocation = (position) => {
    console.log('===== handleGetCurrentLocatioin: position: ', position);
    const { mapActions } = this.props;
    const newLocation = {
      name: "My location",
      coordinate: {
        ...position.coords,
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

  handleDetectDirection = ({distance, duration}) => 
    this.props.mapActions.setDirection({distance, duration});

  onClickRefresh = () => {
    this.props.mapActions.loadPlacesOnMap();
    this.props.mapActions.getAllStations();
  };

  onClickPosition = () => {
    const { map } = this.props;
    const position = (map && map.currentLocation) 
      ? map.currentLocation
      : defaultCurrentLocation;
    (this.mapView && this.mapView.onGoToLocation) && 
      this.mapView.onGoToLocation(position.coordinate);
  }

  goGift = () => {
    Actions.profile()
    Actions['profile_create_team']()
  }

  openSearchDialog = () => {
    this.setState({...this.state, activedModal: 'search'})
  }

  closeSearchDialog = () => {
    this.setState({...this.state, activedModal: 'unlock'});
  }

  selectPlace = (index) => {
    this.props.mapActions.selectPlace(index);
    this.setState({ ...this.state, activedModal: 'detail' });
  }
  //onSelectPlace
  onSelectPlace = (index) => {
    this.selectPlace(index);
  }

  closeDetailDialog = () => {
    this.setState({...this.state, activedModal: 'unlock'}, () => {
      this.props.mapActions.selectPlace(-1);
    });
  }

  openFinishDialog = () => {
    this.setState({...this.state, activedModal: 'finish'});
  }

  closeFinishDialog = () => {
    this.setState({
      ...this.state, activedModal: 'unlock'},
      () => this.props.mapActions.selectPlace(-1)
    );
  }

  openReserveDialog = () => {
    this.setState({...this.state, activedModal: 'reserve'});
  }

  closeReserveDialog = () => {
    this.setState({...this.state, activedModal: 'unlock'});
  }

  openNearPlacesDialog = (index) => {
    this.props.mapActions.selectPlace(index);
    this.setState({...this.state, activedModal: 'near-places'});
  }

  closeNearPlacesDialog = () => {
    const _this = this;
    this.setState({...this.state, activedModal: 'unlock'}, () => {
      _this.props.mapActions.selectPlace(-1);
    });
  }

  openFilterDialog = (index) => {
    this.setState({...this.state, activedModal: 'filter'});
  }

  closeFilterDialog = () => {
    this.setState({...this.state, activedModal: 'unlock'});
  }

  filterSearch = () => {
    
  }

  onBuy = () => {
    const { auth, map, stripeActions } = this.props;
    const { scannedQrCode } = map;
    return stripe.paymentRequestWithCardForm()
      .then(stripeTokenInfo => {
        console.log('Token created: ', stripeTokenInfo);
        // call payment function
        stripeActions.doPaymentRequest({
          amount: '50',
          tokenId: stripeTokenInfo.tokenId,
          email: auth.credential.user.email,
          telnumber: auth.credential.user.phoneNumber,
          stationSn: scannedQrCode,
          slotId: '1',
          currency: 'eur',
          description: `${auth.credential.user.diaplayName} payed via Nono application.`,
          accessToken: null
        });
      })
      .catch(error => {
        console.warn('Payment failed', { error });
      });
  }

  onDeposit = async () => {
    const { auth, rent, stripeActions, rentActions, appActions } = this.props;
    const { _t } = appActions;
    // rentActions.returnedButtery(rent, auth);
    this.setState({depositingButtery: true});
    const res = await returnButtery(rent, auth);
    console.log('===== res: ', res);
    if (res.error) {
      Alert.alert(
        _t('Failed to return the buttery. Please try again.'),
        _t(res.errorMessage),
        [
          {text: _t('OK'), onPress: () => console.log('OK Pressed')},
        ],
        {cancelable: true},
      );
      this.setState({depositingButtery: false});
      return;
    } else {
      Actions['admob']({adMode: 'reward'});
    }
  }

  openFeedbackDialog = () => {
    this.setState({...this.state, activedModal: 'feedback'})
  }

  closeFeedbackDialog = () => {
    this.setState({...this.state, activedModal: 'unlock'})
  }

  onUnlock = () => {
    const { auth, map, stripeActions, stripePayment } = this.props;
    const { scannedQrCode } = map;
    if (stripePayment.customer && stripePayment.customer.id) {
      Actions['map_scan_qr']();
    } else {
      // setup card info
      return stripe.paymentRequestWithCardForm()
              .then(stripeTokenInfo => {
                console.log('Token created: ', stripeTokenInfo);
                // call payment function
                stripeActions.registerCardRequest(
                  {
                    email: auth.credential.user.email,
                    tokenId: stripeTokenInfo.tokenId,
                    stripeTokenInfo
                  },
                  auth
                )
              })
              .catch(error => {
                console.log('Register card failed', { error });
              });
    }
  }

  render() {
    const { currentLocation, places, searchedPlaces, place } = this.props.map;
    const { _t } = this.props.appActions;
    const { profileOpened } = this.state;
    const { activedModal } = this.state;
    const propsProfileOpened = this.props.profileOpened;
    return (
      <View style={{position: 'relative', width: W, height: H}}>
        {/* <Menu 
          isShowable={profileOpened || propsProfileOpened} 
          
        /> */}
        <ProfileMenuDialog isVisible={profileOpened} onClose={()=> {this.setState({profileOpened: false })}} />
        <MapView
          mapType={Platform.OS == "android" ? "none" : "standard"}
          currentLocation={currentLocation}
          places={searchedPlaces}
          selectedPlace={place}
          onSelectMarker={this.openNearPlacesDialog}
          onDetectDirection={this.handleDetectDirection}
          onDetectCurrentLocation={this.handleGetCurrentLocationFromGoogleMap}
          ref={c => this.mapView = c}
        >
          <MapButton
            name='profile'
            onPress={() => {
                this.setState({...this.state, profileOpened: true});
              }
            }
          />
          {/* <MapButton name='tree' onPress={this.goGift}/> */}
          <MapButton name='refresh' onPress={this.onClickRefresh}/>
          <MapButton name='position' onPress={this.onClickPosition}/>
        </MapView>
        <Spacer size={20} />
        {activedModal=='unlock' && <UnlockDialog onClickUnlock={this.onUnlock} />}
        {activedModal=='search' && <SearchDialog onCancel={this.closeSearchDialog} 
          selectPlace={this.selectPlace} />
        }
        {activedModal=='detail' && <DetailDialog
            onClose={this.closeDetailDialog} 
            onFinish={this.openFinishDialog}
            onReserve={this.openReserveDialog}
          />
        }
        {activedModal=='finish' && 
          <React.Fragment>
            <FinishTopDialog />
            <FinishDialog onFinish={this.closeFinishDialog} />
          </React.Fragment>
        }
        {activedModal=='reserve' && 
          <ReserveDialog
            onClose={this.closeReserveDialog} 
            onSelectPlace={this.selectPlace}
          />
        }
        {activedModal=='near-places' && 
          <NearPlacesDialog
            onClose={this.closeNearPlacesDialog} 
            onSelectPlace={this.onSelectPlace}
            onFinish={this.openFinishDialog}
            onReserve={this.openReserveDialog}
            onOpenFilter={this.openFilterDialog}
          />
        }
        {activedModal=='filter' && 
          <FilterDialog
            onClose={this.closeNearPlacesDialog} 
            onFilter={this.filterSearch}
          />
        }
        {activedModal=='rent' && 
          // <RentDialog onBuy={this.openFeedbackDialog} onDeposit={this.openFeedbackDialog} />
          <RentDialog onBuy={this.onBuy} onDeposit={this.onDeposit} loading={this.depositingButtery}/>
        }
        {activedModal=='feedback' && 
          <FeedbackDialog onClose={this.closeFeedbackDialog} />
        }
      </View>
    )
  }
}
