import React from 'react'
import { View, Platform, Alert, PermissionsAndroid } from 'react-native';
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
import { W, H, em } from '~/common/constants';
import { Spacer } from '~/common/components';
import MapButton from '~/modules/map/common/components/MapButton';
import MapView from '~/modules/map/common/components/MapView';
import ProfileMenuDialog from '~/modules/profile/modals/menu/ProfileMenuDialogContainer';
import { returnButtery } from '~/common/services/station-gateway/gateway';
import defaultCurrentLocation from '~/common/config/locations';
import MAP_MODAL from '~/common/constants/map';

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
    activeModal: 'unlock',
    depositingButtery: false
  }

  async componentDidMount() {
    const { initialModal, profileOpened, map } = this.props
    var newState = {...this.state};
    console.log('==== componentDidMount: map.activeModal: ', W, H, em, map.activeModal);
    if (map.activeModal) {
      // this.setState({activeModal: map.activeModal})
      newState = {
        ...newState,
        activeModal: map.activeModal
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

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { map } = nextProps;
    if (!map) return;
    const { activeModal } = map;
    if (this.state.activeModal === activeModal) return;
    console.log('===== activeModal: ', this.state.activeModal, activeModal);
    this.setState({activeModal: activeModal})
  }

  async initGeoLocation() {
    const hasPermission = await this.hasLocationPermission();
    if(hasPermission) {
      // Enable Geolocation

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

  // initModalStatusFromProps = () => {
  //   const { rent } = this.props;
  //   if (rent.isRented) return MAP_MODAL.RENT;
  //   return 
  // }

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
    // mapActions.changedCurrentLocation(newLocation);
    // mapActions.searchPlaces('', newLocation, null);
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
    this.props.mapActions.setActiveModal(MAP_MODAL.SEARCH);
    // this.setState({activeModal: MAP_MODAL.SEARCH});
  }

  closeSearchDialog = () => {
    this.props.mapActions.setActiveModal(MAP_MODAL.UNLOCK);
    // this.setState({activeModal: MAP_MODAL.UNLOCK});
  }

  selectPlace = (index) => {
    this.props.mapActions.selectPlace(index);
    this.props.mapActions.setActiveModal(MAP_MODAL.DETAIL);
    // this.setState({activeModal: MAP_MODAL.DETAIL});
  }
  //onSelectPlace
  onSelectPlace = (index) => {
    this.selectPlace(index);
  }

  closeDetailDialog = () => {
    this.props.mapActions.setActiveModal(MAP_MODAL.UNLOCK);
    this.props.mapActions.selectPlace(-1);
    // this.setState({activeModal: MAP_MODAL.UNLOCK}, () => {
    //   this.props.mapActions.selectPlace(-1);
    // });
  }

  openFinishDialog = () => {
    this.props.mapActions.setActiveModal(MAP_MODAL.FINISH);
    // this.setState({activeModal: 'finish'});
  }

  closeFinishDialog = () => {
    this.props.mapActions.setActiveModal(MAP_MODAL.UNLOCK);
    this.props.mapActions.selectPlace(-1);
    // this.setState({
    //   ...this.state, activeModal: 'unlock'},
    //   () => this.props.mapActions.selectPlace(-1)
    // );
  }

  openReserveDialog = () => {
    this.props.mapActions.setActiveModal(MAP_MODAL.RESERVE);
    // this.setState({activeModal: 'reserve'});
  }

  closeReserveDialog = () => {
    this.props.mapActions.setActiveModal(MAP_MODAL.UNLOCK);
    // this.setState({activeModal: 'unlock'});
  }

  openNearPlacesDialog = (index) => {
    this.props.mapActions.selectPlace(index);
    this.props.mapActions.setActiveModal(MAP_MODAL.NEARE_PLACE);
    // this.setState({activeModal: 'near-places'});
  }

  closeNearPlacesDialog = () => {
    const _this = this;
    this.props.mapActions.setActiveModal(MAP_MODAL.UNLOCK);
    _this.props.mapActions.selectPlace(-1);
    // this.setState({activeModal: 'unlock'}, () => {
    //   _this.props.mapActions.selectPlace(-1);
    // });
  }

  openFilterDialog = (index) => {
    this.props.mapActions.setActiveModal(MAP_MODAL.FILTER);
    // this.setState({activeModal: 'filter'});
  }

  closeFilterDialog = () => {
    this.props.mapActions.setActiveModal(MAP_MODAL.UNLOCK);
    // this.setState({activeModal: 'unlock'});
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
          amount: '2000',
          tokenId: stripeTokenInfo.tokenId,
          email: auth.credential.user.email,
          telnumber: auth.credential.user.phoneNumber,
          stationSn: scannedQrCode,
          slotId: '1',
          currency: 'eur',
          description: `${auth.credential.user.diaplayName ? auth.credential.user.diaplayName : auth.credential.user.email} paid via Nono application.`,
          accessToken: null
        });
      })
      .catch(error => {
        console.warn('Payment failed', { error });
      });
  }

  onDeposit = async () => {
    const { auth, rent, stripeActions, rentActions, mapActions, appActions } = this.props;
    const { _t } = appActions;
    // this.setState({depositingButtery: true});
    // const res = await returnButtery(rent, auth);
    // console.log('===== res: ', res);
    // if (res.error) {
    //   Alert.alert(
    //     _t('Failed to return the buttery. Please try again.'),
    //     _t(res.errorMessage),
    //     [
    //       {text: _t('OK'), onPress: () => console.log('OK Pressed')},
    //     ],
    //     {cancelable: true},
    //   );
    //   this.setState({depositingButtery: false});
    //   return;
    // } else {
    //   Actions['admob']({adMode: 'reward'});
    // }
    mapActions.setActiveModal(MAP_MODAL.FEEDBACK);
    // Actions['map_first']();
    // Actions['admob']({adMode: 'reward'});
  }

  openFeedbackDialog = () => {
    this.props.mapActions.setActiveModal(MAP_MODAL.FEEDBACK);
    // this.setState({activeModal: 'feedback'})
  }

  closeFeedbackDialog = () => {
    this.props.mapActions.setActiveModal(MAP_MODAL.UNLOCK);
    // this.setState({activeModal: 'unlock'})
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
    const { enabledDeposit } = this.props.rent;
    const { _t } = this.props.appActions;
    const { profileOpened } = this.state;
    const { activeModal } = this.state;
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
                this.setState({profileOpened: true});
              }
            }
          />
          {/* <MapButton name='tree' onPress={this.goGift}/> */}
          <MapButton name='refresh' onPress={this.onClickRefresh}/>
          <MapButton name='position' onPress={this.onClickPosition}/>
        </MapView>
        <Spacer size={20} />
        {activeModal== MAP_MODAL.UNLOCK && <UnlockDialog onClickUnlock={this.onUnlock} />}
        {activeModal== MAP_MODAL.SEARCH && <SearchDialog onCancel={this.closeSearchDialog} 
          selectPlace={this.selectPlace} />
        }
        {activeModal== MAP_MODAL.DETAIL && <DetailDialog
            onClose={this.closeDetailDialog} 
            onFinish={this.openFinishDialog}
            onReserve={this.openReserveDialog}
          />
        }
        {activeModal==MAP_MODAL.FINISH && 
          <React.Fragment>
            <FinishTopDialog />
            <FinishDialog onFinish={this.closeFinishDialog} />
          </React.Fragment>
        }
        {activeModal==MAP_MODAL.RESERVE && 
          <ReserveDialog
            onClose={this.closeReserveDialog} 
            onSelectPlace={this.selectPlace}
          />
        }
        {activeModal==MAP_MODAL.NEARE_PLACE && 
          <NearPlacesDialog
            onClose={this.closeNearPlacesDialog} 
            onSelectPlace={this.onSelectPlace}
            onFinish={this.openFinishDialog}
            onReserve={this.openReserveDialog}
            onOpenFilter={this.openFilterDialog}
          />
        }
        {activeModal==MAP_MODAL.FILTER && 
          <FilterDialog
            onClose={this.closeNearPlacesDialog} 
            onFilter={this.filterSearch}
          />
        }
        {activeModal==MAP_MODAL.RENT && 
          // <RentDialog onBuy={this.openFeedbackDialog} onDeposit={this.openFeedbackDialog} />
          <RentDialog
            onBuy={this.onBuy}
            onDeposit={this.onDeposit}
            loading={this.depositingButtery}
            enabledDeposit={enabledDeposit}
          />
        }
        {activeModal==MAP_MODAL.FEEDBACK && 
          <FeedbackDialog onClose={this.closeFeedbackDialog} />
        }
      </View>
    )
  }
}
