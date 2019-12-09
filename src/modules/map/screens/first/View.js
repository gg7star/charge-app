import React from 'react'
import { View,Text, TouchableOpacity, Platform } from 'react-native'
import MapView from '../../common/components/MapView'
import MapButton from '../../common/components/MapButton'
import UnlockDialog from '../../modals/unlock/ViewContainer'
import SearchDialog from '../../modals/search/ViewContainer'
import DetailDialog from '../../modals/detail/ViewContainer'
import FinishDialog from '../../modals/finish/ViewContainer'
import FinishTopDialog from '../../modals/finish-top/ViewContainer'
import ReserveDialog from '../../modals/reserve/ViewContainer'
import NearPlacesDialog from '../../modals/near-places/ViewContainer'
import FilterDialog from '../../modals/filter/ViewContainer'
import RentDialog from '../../modals/rent/ViewContainer'
import FeedbackDialog from '../../modals/feedback/ViewContainer'
import { W, H } from '~/common/constants'
import Menu from '~/modules/profile/modals/menu/ViewContainer'
import { Actions } from 'react-native-router-flux'
import { Spacer } from '~/common/components'
import stripe from 'tipsi-stripe'
import Geolocation from '@react-native-community/geolocation';

stripe.setOptions({
  publishableKey: 'pk_test_ePNxp5U4eZc1CKEg486RGh6g00drRqawLY',
});

export default class ScreenView extends React.Component {
  state = {
    profileOpened: false,
    activedModal: 'unlock'
  }

  componentDidMount() {
    
    const { initialModal } = this.props
    // Get current location
    Geolocation.getCurrentPosition(
      (position) => {
        console.log("==== position: ", position);
        this.props.mapActions.changedCurrentLocation({
          name: "My location",
          coordinate: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null,
          }
        });
      },
      (error) => {
        console.log('===== location error: ', error.message);
      },
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 }
    );
    this.props.mapActions.loadPlacesOnMap()
    if (initialModal) {
      this.setState({
        ...this.state,
        activedModal: initialModal
      })
    }
  }

  render() {
    const { currentLocation, places, place } = this.props.map
    const { _t } = this.props.appActions
    const { profileOpened } = this.state
    const { activedModal } = this.state

    return (
      <View style={{position: 'relative', width: W, height: H}}>
        <Menu 
          isShowable={profileOpened} 
          onClose={()=> this.setState({...this.state, profileOpened: false })}
        />
        <MapView
          mapType={Platform.OS == "android" ? "none" : "standard"}
          currentLocation={currentLocation}
          places={places}
          selectedPlace={place}
          onSelectMarker={this.openNearPlacesDialog}
        >
          <MapButton
            name='profile'
            onPress={() => this.setState({...this.state, profileOpened: true})}
          />
          <MapButton name='gift' onPress={this.goGift}/>
          <MapButton name='search' onPress={this.openSearchDialog}/>
          <MapButton name='refresh' />
          <MapButton name='position' />
        </MapView>
        <Spacer size={20} />
        {activedModal=='unlock' && <UnlockDialog onGoScan={this.goScan} />}
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
          <ReserveDialog onClose={this.closeReserveDialog} 
            onSelectPlace={this.selectPlace}
          />
        }
        {activedModal=='near-places' && 
          <NearPlacesDialog onClose={this.closeNearPlacesDialog} 
            onSelectPlace={this.selectPlace}
            onFinish={this.openFinishDialog} onReserve={this.openReserveDialog}
            onOpenFilter={this.openFilterDialog}
          />
        }
        {activedModal=='filter' && 
          <FilterDialog onClose={this.closeNearPlacesDialog} 
            onFilter={this.filterSearch}
          />
        }
        {activedModal=='rent' && 
          // <RentDialog onBuy={this.openFeedbackDialog} onDeposit={this.openFeedbackDialog} />
          <RentDialog onBuy={this.onBuy} onDeposit={this.onDeposit} />
        }
        {activedModal=='feedback' && 
          <FeedbackDialog onClose={this.closeFeedbackDialog} />
        }
        
      </View>
    )
  }

  goGift = () => {
    Actions['map_gift']()
  }

  openSearchDialog = () => {
    this.setState({...this.state, activedModal: 'search'})
  }

  closeSearchDialog = () => {
    this.setState({...this.state, activedModal: 'unlock'})
  }

  selectPlace = (index) => {
    this.props.mapActions.selectPlace(index)
    this.setState({ ...this.state, activedModal: 'detail' })
  }

  closeDetailDialog = () => {
    this.setState({...this.state, activedModal: 'unlock'})
  }

  openFinishDialog = () => {
    this.setState({...this.state, activedModal: 'finish'})
  }

  closeFinishDialog = () => {
    this.setState({...this.state, activedModal: 'unlock'})
  }

  openReserveDialog = () => {
    this.setState({...this.state, activedModal: 'reserve'})
  }

  closeReserveDialog = () => {
    this.setState({...this.state, activedModal: 'unlock'})
  }

  openNearPlacesDialog = (index) => {
    this.setState({...this.state, activedModal: 'near-places'})
  }

  closeNearPlacesDialog = () => {
    this.setState({...this.state, activedModal: 'unlock'})
  }

  openFilterDialog = (index) => {
    this.setState({...this.state, activedModal: 'filter'})
  }

  closeFilterDialog = () => {
    this.setState({...this.state, activedModal: 'unlock'})
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
          email: auth.accountInfo.email,
          telnumber: auth.accountInfo.phoneNumber,
          stationSn: scannedQrCode,
          slotId: '1',
          currency: 'eur',
          description: `${auth.accountInfo.name} payed via Nono application.`,
          accessToken: null
        })
      })
      .catch(error => {
        console.warn('Payment failed', { error });
      });
  }

  onDeposit = () => {
    const { auth, stripeActions } = this.props;
    return stripe.paymentRequestWithCardForm()
      .then(stripeTokenInfo => {
        console.log('Token created: ', stripeTokenInfo);
        // call payment function
        stripeActions.doPaymentRequest({
          amount: '50',
          tokenId: stripeTokenInfo.tokenId,
          email: auth.accountInfo.email,
          telnumber: auth.accountInfo.phoneNumber,
          stationSn: 'T1219071904',
          slotId: '1',
          currency: 'eur',
          description: `${auth.accountInfo.name} payed via Nono application.`,
          accessToken: null
        })
      })
      .catch(error => {
        console.warn('Payment failed', { error });
      });
  }

  openFeedbackDialog = () => {
    this.setState({...this.state, activedModal: 'feedback'})
  }

  closeFeedbackDialog = () => {
    this.setState({...this.state, activedModal: 'unlock'})
  }

  goScan = () => {
    Actions['map_scan_qr']()
    // For test
    // Actions['map_enter_code']()
  }
}
