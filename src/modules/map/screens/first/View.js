import React from 'react'
import { View, Platform } from 'react-native';
import { Actions } from 'react-native-router-flux';
import stripe from 'tipsi-stripe';
import MapView from '../../common/components/MapView';
import MapButton from '../../common/components/MapButton';
import UnlockDialog from '../../modals/unlock/ViewContainer';
import SearchDialog from '../../modals/search/ViewContainer';
import DetailDialog from '../../modals/detail/ViewContainer';
import FinishDialog from '../../modals/finish/ViewContainer';
import FinishTopDialog from '../../modals/finish-top/ViewContainer';
import ReserveDialog from '../../modals/reserve/ViewContainer';
import NearPlacesDialog from '../../modals/near-places/ViewContainer';
import FilterDialog from '../../modals/filter/ViewContainer';
import RentDialog from '../../modals/rent/ViewContainer';
import FeedbackDialog from '../../modals/feedback/ViewContainer';
import { W, H } from '~/common/constants';
import Menu from '~/modules/profile/modals/menu/ViewContainer';
import { Spacer } from '~/common/components';

export default class ScreenView extends React.Component {
  state = {
    profileOpened: false,
    activedModal: 'unlock'
  }

  componentDidMount() {
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
    this.setState({...newState})
  }


  handleDetectDirection = ({distance, duration}) => {
    this.props.mapActions.setDirection({distance, duration});
  }

  render() {
    const { currentLocation, places, searchedPlaces, place } = this.props.map;
    const { _t } = this.props.appActions;
    const { profileOpened } = this.state;
    const { activedModal } = this.state;
    const propsProfileOpened = this.props.profileOpened;
    return (
      <View style={{position: 'relative', width: W, height: H}}>
        <Menu 
          isShowable={profileOpened || propsProfileOpened} 
          onClose={()=> {this.setState({...this.state, profileOpened: false })}}
        />
        <MapView
          mapType={Platform.OS == "android" ? "none" : "standard"}
          currentLocation={currentLocation}
          places={searchedPlaces}
          selectedPlace={place}
          onSelectMarker={this.openNearPlacesDialog}
          onDetectDirection={this.handleDetectDirection}
        >
          <MapButton
            name='profile'
            onPress={() => {
                this.setState({...this.state, profileOpened: true});
              }
            }
          />
          <MapButton name='tree' onPress={this.goGift}/>
          {/* <MapButton name='search' onPress={this.openSearchDialog}/> */}
          <MapButton name='refresh' />
          <MapButton name='position' />
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
          <RentDialog onBuy={this.onBuy} onDeposit={this.onDeposit} />
        }
        {activedModal=='feedback' && 
          <FeedbackDialog onClose={this.closeFeedbackDialog} />
        }
        
      </View>
    )
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
    console.log('==== index: ', index);
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
    this.setState({...this.state, activedModal: 'unlock'});
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
          email: auth.accountInfo.email,
          telnumber: auth.accountInfo.phoneNumber,
          stationSn: scannedQrCode,
          slotId: '1',
          currency: 'eur',
          description: `${auth.accountInfo.name} payed via Nono application.`,
          accessToken: null
        });
      })
      .catch(error => {
        console.warn('Payment failed', { error });
      });
  }

  onDeposit = async () => {
    const { auth, stripeActions, rentActions } = this.props;
    Actions['admob']({adMode: 'reward'});
  }

  openFeedbackDialog = () => {
    this.setState({...this.state, activedModal: 'feedback'})
  }

  closeFeedbackDialog = () => {
    this.setState({...this.state, activedModal: 'unlock'})
  }

  onUnlock = () => {
    const { auth, map, stripeActions } = this.props;
    const { scannedQrCode } = map;
    const stripeProps = this.props.stripe;
    if (stripeProps.customer && stripeProps.customer.id) {
      Actions['map_scan_qr']();
    } else {
      // setup card info
      return stripe.paymentRequestWithCardForm()
              .then(stripeTokenInfo => {
                console.log('Token created: ', stripeTokenInfo);
                // call payment function
                stripeActions.registerCardRequest({
                  email: auth.accountInfo.email,
                  tokenId: stripeTokenInfo.tokenId
                })
              })
              .catch(error => {
                console.log('Register card failed', { error });
              });
    }
  }
}
