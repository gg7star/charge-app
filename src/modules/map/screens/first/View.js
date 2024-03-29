import React from 'react';
import { View, Platform, Alert, PermissionsAndroid } from 'react-native';
import { openSettings } from 'react-native-permissions';
import { Actions } from 'react-native-router-flux';
import stripe from 'tipsi-stripe';
import Geolocation from 'react-native-geolocation-service';
import {
  UnlockDialog,
  SearchDialog,
  DetailDialog,
  FindNearestDialog,
  FinishDialog,
  FinishTopDialog,
  ReserveDialog,
  NearPlacesDialog,
  FilterDialog,
  RentDialog,
  FeedbackDialog,
  CreditCardDialog,
  ConfirmAddCardDialog
} from '~/modules/map/modals';
import { W, H, em } from '~/common/constants';
import { Spacer } from '~/common/components';
import MapButton from '~/modules/map/common/components/MapButton';
import MapView from '~/modules/map/common/components/MapView';
import ClusterMapView from '~/modules/map/common/components/ClusterMapView';
import MapClusteringView from '~/modules/map/common/components/MapClusteringView';
import ProfileMenuDialog from '~/modules/profile/modals/menu/ProfileMenuDialogContainer';
import defaultCurrentLocation from '~/common/config/locations';
import MAP_MODAL from '~/common/constants/map';
import { RENT_STATUS } from '~/common/constants/rent';
import { openHourStatus } from '~/common/utils/time';
import { getDistance } from '~/common/utils/filterPlaces';
import {
  requireCameraPermission,
  requireLocationPermission,
  requireNotificationPermission
} from '~/common/utils/permissions';
import moment from 'moment';

const LOCATION_CHECH_INTERVAL = 10000; // 10 seconds

const GEOLOCATION_OPTION = {
  enableHighAccuracy: true,
  timeout: 40000,
  // maximumAge: 10000,
  distanceFilter: 0,
  forceRequestLocation: true,
  watchId: null
};
const GEOLOCATION_WATCH_OPTION = {
  enableHighAccuracy: false,
  distanceFilter: 0,
  interval: LOCATION_CHECH_INTERVAL,
  fastestInterval: LOCATION_CHECH_INTERVAL
}

export default class FirstScreenView extends React.Component {
  watchId = null;

  state = {
    profileOpened: false,
    activeModal: 'unlock',
    depositingBattery: false,
    rentStatus: RENT_STATUS.INIT,
    showCreditSettingModal: false,
    showConfirmAddCreditCardDialog: false,
    currentLocation: null,
    prevTime: moment().valueOf(),
  };
  
  async componentDidMount() {
    const { initialModal, profileOpened, map, rent } = this.props
    var newState = {...this.state, rentStatus: rent.rentStatus};
    if (map.activeModal) {
      newState = {
        ...newState,
        activeModal: map.activeModal
      }
    }

    if (map.currentLocation && 
      map.currentLocation.coordinate && 
      map.currentLocation.coordinate.latitude) {
        newState = {
          ...newState,
          currentLocation: map.currentLocation
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

    // Require notification permission again.
    const { _t } = this.props.appActions;
    const notificationPermisionStatus = await requireNotificationPermission(_t);
  }

  async componentWillUnmount() {
    // const { watchId } = this.state;
    if (this.watchId) {
      await Geolocation.clearWatch(this.watchId);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { map } = nextProps;
    if (!map) return;
    const { activeModal } = map;
    if (this.state.activeModal === activeModal) return;
    this.setState({activeModal: activeModal})
  }

  async initGeoLocation() {
    // const hasPermission = await this.hasLocationPermission();
    const { _t } = this.props.appActions;
    console.log('==== initGeoLocation');
    const hasPermission = await requireLocationPermission(_t)
    if(hasPermission) {
      // Enable Geolocation

      Geolocation.requestAuthorization();
      // Map
      const _this = this;
      // Get current location
      // Geolocation.getCurrentPosition(
      //   (position) => { _this.handleGetCurrentLocation(position) },
      //   (error) => { _this.handleCurrentLocationError(error) },
      //   GEOLOCATION_OPTION
      // );

      this.watchId = Geolocation.watchPosition(
        (position) => { _this.handleGetCurrentLocation(position) },
        (error) => { _this.handleCurrentLocationError(error) },
        GEOLOCATION_WATCH_OPTION
      );
    }
  }

  isLocationCheckTimeOver = () => {
    const { prevTime } = this.state;
    const currentTime = moment().valueOf();
    const res = ((currentTime - prevTime) >= LOCATION_CHECH_INTERVAL);
    if (res) this.setState({ prevTime: currentTime});
    return res;
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
      // ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      // ToastAndroid.show('Location permission revoked by user.', ToastAndroid.LONG);
    }

    return false;
  }

  handleGetCurrentLocationFromGoogleMap = (coordinate) => {
    if (!this.isLocationCheckTimeOver()) return;
      const { mapActions, map } = this.props;
      const { currentLocation } = this.state;
      if (currentLocation && currentLocation.coordinate &&
        (currentLocation.coordinate.latitude === coordinate.latitude) &&
        (currentLocation.coordinate.longitude === coordinate.longitude)
      ) return;

      const newLocation = {
        name: "My location",
        coordinate: {
          ...coordinate,
          error: null,
        }
      };
      this.setState({ currentLocation: newLocation });
      mapActions.changedCurrentLocation(newLocation);
  }

  handleGetCurrentLocation = (position) => {
    if (!this.isLocationCheckTimeOver()) return;

    const { mapActions, map } = this.props;
    const { currentLocation } = this.state;
    if (currentLocation && 
      currentLocation.coordinate &&
      (currentLocation.coordinate.latitude === position.latitude) &&
      (currentLocation.coordinate.longitude === position.longitude))
      return;

    const newLocation = {
      name: "My location",
      coordinate: {
        ...position.coords,
        error: null,
      }
    };
    this.setState({ currentLocation: newLocation }, () => {
      mapActions.changedCurrentLocation(newLocation);
    });
  }

  handleCurrentLocationError = (error) => {
    console.log('===== location error: ', error);
    const myLocation = this.state.currentLocation || defaultCurrentLocation;
    if (myLocation && !myLocation.coordinate.error) {
      // Set previous location.
      const prevCoordinate = myLocation.coordinate;
      const prevLocation = {
        name: "My location",
        coordinate: {
          latitude: prevCoordinate.latitude,
          longitude: prevCoordinate.longitude,
          error: error.message,
        }
      };
      this.setState({ currentLocation: prevLocation });
    }
  }

  handleDetectDirection = ({distance, duration}) => 
    this.props.mapActions.setDirection({distance, duration});

  onClickRefresh = () => {
    this.props.mapActions.loadPlacesOnMap();
    this.props.mapActions.getAllStations();
  };

  onClickPosition = () => {
    const { currentLocation } = this.state;
    const position = currentLocation || defaultCurrentLocation;
    (this.mapView && this.mapView.onGoToLocation) && 
      position && this.mapView.onGoToLocation(position.coordinate);
  }

  goGift = () => {
    Actions.profile()
    Actions['profile_create_team']()
  }

  openSearchDialog = () => {
    this.props.mapActions.setActiveModal(MAP_MODAL.SEARCH);
  }

  closeSearchDialog = () => {
    this.props.mapActions.setActiveModal(MAP_MODAL.UNLOCK);
  }

  selectPlace = (index) => {
    const { mapActions, map } = this.props;
    const { searchedPlaces } = map;
    const place = ((index == -1) && searchedPlaces)
      ? null : searchedPlaces[index]
    mapActions.selectPlace(index, place);
    mapActions.setActiveModal(MAP_MODAL.DETAIL);
  }
  //onSelectPlace
  onSelectPlace = (index) => {
    this.selectPlace(index);
  }

  closeDetailDialog = () => {
    this.props.mapActions.setActiveModal(MAP_MODAL.UNLOCK);
    this.props.mapActions.selectPlace(-1, null);
  }

  openFinishDialog = () => {
    this.props.mapActions.setActiveModal(MAP_MODAL.FINISH);
  }

  closeFinishDialog = () => {
    this.props.mapActions.setActiveModal(MAP_MODAL.UNLOCK);
    this.props.mapActions.selectPlace(-1, null);
  }

  openReserveDialog = () => {
    this.props.mapActions.setActiveModal(MAP_MODAL.RESERVE);
  }

  closeReserveDialog = () => {
    this.props.mapActions.setActiveModal(MAP_MODAL.UNLOCK);
  }

  openNearPlacesDialog = (index) => {
    const { mapActions, map } = this.props;
    const { searchedPlaces } = map;
    const place = ((index == -1) && !searchedPlaces) ? null : searchedPlaces[index]
    mapActions.selectPlace(index, place);
    mapActions.setActiveModal(MAP_MODAL.NEARE_PLACE);
  }

  closeNearPlacesDialog = () => {
    const _this = this;
    this.props.mapActions.setActiveModal(MAP_MODAL.UNLOCK);
    _this.props.mapActions.selectPlace(-1, null);
  }

  openFilterDialog = (index) => {
    this.props.mapActions.setActiveModal(MAP_MODAL.FILTER);
  }

  closeFilterDialog = () => {
    this.props.mapActions.setActiveModal(MAP_MODAL.UNLOCK);
  }

  filterSearch = () => {}

  findNearest = () => {
    const { map } = this.props;
    const { searchedPlaces } = map;
    const { currentLocation } = this.state;
    var minDistance = null;
    var minIndex = 0;
    var myLocation = currentLocation || defaultCurrentLocation;
    console.log('==== myLocation: ', currentLocation, myLocation);

    for (var i = 0; i < searchedPlaces.length; i++) {
      const place = searchedPlaces[i];
      // Check stations in place
      if (place.stations && (place.stations.length == 0)) continue;
      // Check current opening status of place
      const hourStatus = openHourStatus(place.openHours);
      // if (!hourStatus.openStatus) continue;
      // Calculate minimum distance.
      var placeDistance = getDistance(
        myLocation.coordinate.latitude,
        myLocation.coordinate.longitude,
        place.coordinate.latitude,
        place.coordinate.longitude,
        'K'
      );
      if (!minDistance || (minDistance > placeDistance)) {
        minDistance = placeDistance;
        minIndex = i;
      }
    }
    console.log('===== places[minIndex]: ', minIndex, searchedPlaces[minIndex]);
    if (searchedPlaces.length > 0) {
      (this.mapView && this.mapView.onGoToLocation) &&
        this.mapView.onGoToLocation(searchedPlaces[minIndex].coordinate);
      this.openNearPlacesDialog(minIndex);
    }
  }

  processPayment = () => {
    const { auth, rent, stripeActions, stripePayment } = this.props;
    const { cardInfo, customer } = stripePayment;
    const { _t } = this.props.appActions;

    if (stripePayment.customer && stripePayment.customer.id) {
      // call payment function
      stripeActions.doPaymentRequest({
          amount: '2000',
          tokenId: cardInfo.tokenId,
          customerId: customer.id,
          email: auth.credential.user.email,
          telnumber: auth.credential.user.phoneNumber,
          stationSn: rent.stationSn,
          slotId: rent.slotNum,
          powerBankSn: rent.powerBankSn,
          tradeNo: rent.tradeNo,
          rentedPlaceAddress: rent.rentedPlaceAddress,
          currency: 'eur',
          description: `${auth.credential.user.displayName || auth.credential.user.email} ${_t('paid via Nono application.')}`,
          accessToken: null
        },
        auth
      );
    } else {
      return stripe.paymentRequestWithCardForm()
      .then(cardInfo => {
        console.log('==== Token created: ', cardInfo);
        // call payment function
        stripeActions.doPaymentRequest({
          amount: '2000',
          tokenId: cardInfo.tokenId,
          email: auth.credential.user.email,
          telnumber: auth.credential.user.phoneNumber,
          stationSn: rent.stationSn,
          slotId: rent.slotNum,
          powerBankSn: rent.powerBankSn,
          tradeNo: rent.tradeNo,
          rentedPlaceAddress: rent.rentedPlaceAddress,
          currency: 'eur',
          description: `${auth.credential.user.displayName || auth.credential.user.email} paid via Nono application.`,
          accessToken: null
        },
        auth
        );
      })
      .catch(error => {
        console.warn('Payment failed', { error });
        Alert.alert(
          _t('Failed payment'),
          _t('Your payment was failed. Please try again later.'),
          [
            {text: _t('Ok'), onPress: () => console.log('clicked ok.')}
          ],
          {cancelable: true},
        );
      });
    }
  }

  onBuy = () => {
    const { _t } = this.props.appActions;
    Alert.alert(
      _t('Confirm payment'),
      _t('Are you sure you want to buy this battery for 20.00€ ?'),
      [
        {text: _t('Cancel'), onPress: () => console.log('clicked cancel.')},
        {text: _t('Yes, I want it!'), onPress: () => this.processPayment()},
      ],
      {cancelable: true},
    );
  }

  onDeposit = async () => {
    const { auth, rent, stripeActions, rentActions, mapActions, appActions } = this.props;
    const { _t } = appActions;
    rentActions.requireFeedback();
  }

  openFeedbackDialog = () => {
    // this.props.mapActions.setActiveModal(MAP_MODAL.FEEDBACK);
  }

  closeFeedbackDialog = () => {
    // this.props.mapActions.setActiveModal(MAP_MODAL.UNLOCK);
    this.props.rentActions.rentInit();
  }

  hanldeValidateCreditCard = ({cardInfo, cardToken}) => {
    const { stripeActions, auth } = this.props;
    stripeActions.registerCardRequest(
      {
        email: auth.credential.user.email,
        tokenId: cardToken.tokenId,
        cardInfo,
        cardToken
      },
      auth
    );
    this.setState({
      showCreditSettingModal: false,
      showConfirmAddCreditCardDialog: false
    });
  }

  closeCreditCardDialog = () => {
    this.setState({
      showCreditSettingModal: false,
      showConfirmAddCreditCardDialog: true
    });
  }

  onAddCreditCard = () => {
    this.setState({
      showConfirmAddCreditCardDialog: false,
      showCreditSettingModal: true
    })
  }

  closeConfirmAddCreditCardDialog = () => {
    this.setState({showConfirmAddCreditCardDialog: false})
  }

  onUnlock = async () => {
    const { auth, map, stripeActions, stripePayment } = this.props;
    const { scannedQrCode } = map;
    const { _t } = this.props.appActions;
    const cameraPermissionStatus = await requireCameraPermission(_t);
    const notificationPermisionStatus = await requireNotificationPermission(_t);

    if (cameraPermissionStatus && notificationPermisionStatus) {
      if (stripePayment.customer && stripePayment.customer.id) {
        Actions['map_scan_qr']();
      } else {
        // setup card info
        this.setState({ showConfirmAddCreditCardDialog: true });
      }
    } else {
      Alert.alert(
        _t('Check permissions for camera and notification'),
        _t('You must allow the permissions for camera and notification to rent a battery. Would you setup them on phone settings?'),
        [
          {
            text: _t('Ok'),
            onPress: () => {
              // Open settings.
              openSettings().catch(() => console.warn('cannot open settings'));
            }
          }
        ],
        { cancelable: false },
      );
    }
  }

  renderMapView = () => {
    const { places, searchedPlaces, place } = this.props.map;
    const { enabledDeposit, rentStatus } = this.props.rent;
    const { _t } = this.props.appActions;
    const {
      currentLocation, profileOpened, activeModal,
      showCreditSettingModal, showConfirmAddCreditCardDialog
    } = this.state;
    const propsProfileOpened = this.props.profileOpened;
    const location = currentLocation || defaultCurrentLocation;

    return (
      <MapView
        currentLocation={location}
        places={searchedPlaces}
        selectedPlace={place}
        onSelectMarker={this.openNearPlacesDialog}
        onDetectDirection={this.handleDetectDirection}
        onDetectCurrentLocation={this.handleGetCurrentLocationFromGoogleMap}
        ref={c => this.mapView = c}>
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
    );
  };

  renderClusterMapView = () => {
    const { searchedPlaces, place } = this.props.map;
    const { enabledDeposit, rentStatus } = this.props.rent;
    const { activeModal, currentLocation } = this.state;
    const location = currentLocation || defaultCurrentLocation;
    const showBottomButtons = !(
      (activeModal == MAP_MODAL.NEARE_PLACE)
      || (activeModal == MAP_MODAL.RENT) 
      || (activeModal == MAP_MODAL.FINISH)
      || (activeModal == MAP_MODAL.FEEDBACK)
    ) && 
    ((rentStatus < RENT_STATUS.RENT_REQUEST) 
      || (rentStatus > RENT_STATUS.REQUIRED_FEEDBACK)
    );
    
    return (
      <ClusterMapView
          currentLocation={location}
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
          {/* <MapButton name='search' onPress={this.onClickRefresh} /> */}
          {showBottomButtons && <MapButton name='refresh' onPress={this.onClickRefresh}/>}
          {showBottomButtons && <MapButton name='position' onPress={this.onClickPosition}/>}
        </ClusterMapView>
    );
  }

  renderMapClusteringView = () => {
    const { searchedPlaces, place } = this.props.map;
    const { activeModal, currentLocation } = this.state;
    const location = currentLocation || defaultCurrentLocation;
    console.log('===== renderMapClusteringView: location: ', location)
    return (
      <MapClusteringView
        currentLocation={location}
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
            this.setState({ profileOpened: true });
          }}
        />
        {/* <MapButton name='tree' onPress={this.goGift}/> */}
        {/* <MapButton name='search' onPress={this.onClickRefresh} /> */}
        {activeModal != MAP_MODAL.NEARE_PLACE && <MapButton name='refresh' onPress={this.onClickRefresh} />}
        {activeModal != MAP_MODAL.NEARE_PLACE && <MapButton name='position' onPress={this.onClickPosition} />}
      </MapClusteringView>
    );
  }

  render() {
    const { enabledDeposit, rentStatus } = this.props.rent;
    const {
      profileOpened, activeModal,
      showCreditSettingModal, showConfirmAddCreditCardDialog
    } = this.state;

    return (
      <View style={{position: 'relative', width: '100%', height: '100%'}}>
        <ProfileMenuDialog
          isVisible={profileOpened}
          onClose={()=> {this.setState({profileOpened: false })}}
        />
        {/* { this.renderMapView() } */}
        { this.renderClusterMapView() }
        {/* {this.renderMapClusteringView()} */}
        <Spacer size={20} />
        <FindNearestDialog onClickFind={this.findNearest} />
        {(activeModal != MAP_MODAL.NEARE_PLACE) && <UnlockDialog onClickUnlock={this.onUnlock} />}
        {(activeModal == MAP_MODAL.SEARCH) && <SearchDialog onCancel={this.closeSearchDialog} 
          selectPlace={this.selectPlace} />
        }
        {(activeModal == MAP_MODAL.DETAIL) && <DetailDialog
            onClose={this.closeDetailDialog} 
            onFinish={this.openFinishDialog}
            onReserve={this.openReserveDialog}
          />
        }
        {(activeModal == MAP_MODAL.FINISH) && 
          <React.Fragment>
            <FinishTopDialog />
            <FinishDialog onFinish={this.closeFinishDialog} />
          </React.Fragment>
        }
        {(activeModal == MAP_MODAL.RESERVE) && 
          <ReserveDialog
            onClose={this.closeReserveDialog} 
            onSelectPlace={this.selectPlace}
          />
        }
        {(activeModal == MAP_MODAL.NEARE_PLACE) && 
          <NearPlacesDialog
            onClose={this.closeNearPlacesDialog} 
            onSelectPlace={this.onSelectPlace}
            onFinish={this.openFinishDialog}
            onReserve={this.openReserveDialog}
            onOpenFilter={this.openFilterDialog}
          />
        }
        {(activeModal == MAP_MODAL.FILTER) && 
          <FilterDialog
            onClose={this.closeNearPlacesDialog} 
            onFilter={this.filterSearch}
          />
        }
        {(((rentStatus == RENT_STATUS.RENTED) || (rentStatus == RENT_STATUS.RETURNED)) && 
          (activeModal != MAP_MODAL.FINISH) &&
          (activeModal!=MAP_MODAL.NEARE_PLACE) && 
          (activeModal!=MAP_MODAL.DETAIL)
          ) && 
          <RentDialog
            onBuy={this.onBuy}
            onDeposit={this.onDeposit}
            onAutoBuy={this.processPayment}
            loading={this.depositingBattery}
            enabledDeposit={enabledDeposit}
          />
        }
        {((rentStatus == RENT_STATUS.REQUIRED_FEEDBACK) && 
          (activeModal != MAP_MODAL.FINISH) && 
          (activeModal != MAP_MODAL.NEARE_PLACE) && 
          (activeModal != MAP_MODAL.DETAIL)
          ) &&
          <FeedbackDialog onClose={this.closeFeedbackDialog} />
        }
        {showConfirmAddCreditCardDialog &&
          <ConfirmAddCardDialog
            onCancel={this.closeConfirmAddCreditCardDialog}
            onAdd={this.onAddCreditCard}
          />
        }
        <CreditCardDialog
          isVisible={showCreditSettingModal}
          appActions={this.props.appActions}
          onValidate={this.hanldeValidateCreditCard}
          onCancel={this.closeCreditCardDialog}
        />
      </View>
    );
  }
}
