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
  CreditCardDialog,
  ConfirmAddCardDialog
} from '~/modules/map/modals';
import { W, H, em } from '~/common/constants';
import { Spacer } from '~/common/components';
import MapButton from '~/modules/map/common/components/MapButton';
import MapView from '~/modules/map/common/components/MapView';
import ClusterMapView from '~/modules/map/common/components/ClusterMapView';
import ProfileMenuDialog from '~/modules/profile/modals/menu/ProfileMenuDialogContainer';
import defaultCurrentLocation from '~/common/config/locations';
import MAP_MODAL from '~/common/constants/map';
import { RENT_STATUS } from '~/common/constants/rent';

const GEOLOCATION_OPTION = {
  enableHighAccuracy: true,
  timeout: 20000,
  maximumAge: 10000,
  distanceFilter: 50,
  forceRequestLocation: true,
  watchId: null
};
const GEOLOCATION_WATCH_OPTION = {
  enableHighAccuracy: false,
  distanceFilter: 0,
  interval: 15000,
  fastestInterval: 10000
}

export default class FirstScreenView extends React.Component {
  state = {
    profileOpened: false,
    activeModal: 'unlock',
    depositingBattery: false,
    rentStatus: RENT_STATUS.INIT,
    showCreditSettingModal: false,
    showConfirmAddCreditCardDialog: false
  }

  async componentDidMount() {
    const { initialModal, profileOpened, map, rent } = this.props
    var newState = {...this.state, rentStatus: rent.rentStatus};
    if (map.activeModal) {
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

    const watchId = await this.initGeoLocation();
    this.onClickPosition();
    this.setState({ watchId });
  }

  async componentWillUnmount() {
    const { watchId } = this.state;
    if (watchId) {
      Geolocation.clearWatch(watchId);
      Geolocation.stopObserving();
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
    // if (this.props.map.currentLocation) {
    //   // Set previous location.
    //   const prevCordinate = this.props.map.currentLocation.coordinate;
    //   this.props.mapActions.changedCurrentLocation({
    //     name: "My location",
    //     coordinate: {
    //       latitude: prevCordinate.latitude,
    //       longitude: prevCordinate.longitude,
    //       error: error.message,
    //     }
    //   });
    // }
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
    // this.setState({depositingBattery: true});
    // const res = await returnBattery(rent, auth);
    // console.log('===== res: ', res);
    // if (res.error) {
    //   Alert.alert(
    //     _t('Failed to return the battery. Please try again.'),
    //     _t(res.errorMessage),
    //     [
    //       {text: _t('OK'), onPress: () => console.log('OK Pressed')},
    //     ],
    //     {cancelable: true},
    //   );
    //   this.setState({depositingBattery: false});
    //   return;
    // } else {
    //   Actions['admob']({adMode: 'reward'});
    // }
    
    // mapActions.setActiveModal(MAP_MODAL.FEEDBACK);
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

  onUnlock = () => {
    const { auth, map, stripeActions, stripePayment } = this.props;
    const { scannedQrCode } = map;
    if (stripePayment.customer && stripePayment.customer.id) {
      Actions['map_scan_qr']();
    } else {
      // setup card info
      this.setState({showConfirmAddCreditCardDialog: true});
    }
  }

  renderMapView = () => {
    const { currentLocation, places, searchedPlaces, place } = this.props.map;
    const { enabledDeposit, rentStatus } = this.props.rent;
    const { _t } = this.props.appActions;
    const {
      profileOpened, activeModal,
      showCreditSettingModal, showConfirmAddCreditCardDialog
    } = this.state;
    const propsProfileOpened = this.props.profileOpened;
    const location = currentLocation || defaultCurrentLocation;

    return (
      <MapView
          mapType={Platform.OS == "android" ? "none" : "standard"}
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
          <MapButton name='refresh' onPress={this.onClickRefresh}/>
          <MapButton name='position' onPress={this.onClickPosition}/>
        </MapView>
    );
  };

  renderClusterMapView = () => {
    const { currentLocation, searchedPlaces, place } = this.props.map;
    const { activeModal } = this.state;
    const location = currentLocation || defaultCurrentLocation;

    return (
      <ClusterMapView
          mapType={Platform.OS == "android" ? "none" : "standard"}
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
          {activeModal!=MAP_MODAL.NEARE_PLACE && <MapButton name='refresh' onPress={this.onClickRefresh}/>}
          {activeModal!=MAP_MODAL.NEARE_PLACE && <MapButton name='position' onPress={this.onClickPosition}/>}
        </ClusterMapView>
    );
  }

  render() {
    const { enabledDeposit, rentStatus } = this.props.rent;
    const {
      profileOpened, activeModal,
      showCreditSettingModal, showConfirmAddCreditCardDialog
    } = this.state;

    return (
      <View style={{position: 'relative', width: W, height: H}}>
        {/* <Menu 
          isShowable={profileOpened || propsProfileOpened} 
          
        /> */}
        <ProfileMenuDialog isVisible={profileOpened} onClose={()=> {this.setState({profileOpened: false })}} />
        {/* { this.renderMapView() } */}
        { this.renderClusterMapView() }
        <Spacer size={20} />
        {activeModal!=MAP_MODAL.NEARE_PLACE && <UnlockDialog onClickUnlock={this.onUnlock} />}
        {/* <UnlockDialog onClickUnlock={this.onUnlock} /> */}
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
        {(((rentStatus == RENT_STATUS.RENTED) || (rentStatus == RENT_STATUS.RETURNED)) && 
          (activeModal != MAP_MODAL.FINISH) &&
          (activeModal!=MAP_MODAL.NEARE_PLACE) && 
          (activeModal!=MAP_MODAL.DETAIL)
          )&& 
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
          (activeModal!=MAP_MODAL.NEARE_PLACE) && 
          (activeModal!=MAP_MODAL.DETAIL)
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
