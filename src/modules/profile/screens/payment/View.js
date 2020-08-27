import React from 'react'
import { TouchableOpacity, View, Text, Image, Linking } from 'react-native';
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/MaterialIcons';
import ProfileWrapper from '../../common/wrappers/ProfileWrapper';
import { ProfileHeader } from '~/common/components';
import { W, H, em } from '~/common/constants';
import { Button, Spacer } from '~/common/components';
import CardForm from '~/modules/profile/screens/card-form/ViewContainer';

const AMERICAN_EXPRESS_CARD_IMAGE = require('~/common/assets/images/cards/american-express.png');
const DISCOVER_CARD_IMAGE = require('~/common/assets/images/cards/discover.png');
const MASTER_CARD_IMAGE = require('~/common/assets/images/cards/master-card.png');
const VISA_CARD_IMAGE = require('~/common/assets/images/cards/visa.png');

const CARDS = [
  {
    type: 'American Express',
    image: AMERICAN_EXPRESS_CARD_IMAGE
  },
  {
    type: 'Discover',
    image: DISCOVER_CARD_IMAGE
  },
  {
    type: 'Mastercard',
    image: MASTER_CARD_IMAGE
  },
  {
    type: 'Visa',
    image: VISA_CARD_IMAGE
  },
]


export default class PaymentSettingView extends React.Component {
  state = {
    showCardForm: false,
  };

  goBack = () => {
    const { onClose } = this.props;
    onClose && onClose();
  }

  addCreditCard = () => {
    const { auth, profileActions, stripeActions } = this.props;
    // Actions['profile_payment_card']();
    this.setState({ showCardForm: true });
  };

  handleCloseCardForm = () => {
    this.setState({ showCardForm: false });
  }

  onClearCard = () => this.props.stripeActions.initStripe();

  onClickWhy = () => Linking.openURL('https://nono.services/cgv/');

  renderCardInfo = (cardInfo) => {
    // const cardInfo = customer.sources.data[0];
    const {brand, country, expMonth, expYear, funding, last4} = cardInfo;
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
        <View style={{flex: 1, marginRight: 10, alignItems: 'center'}}>
          <Image
            source={require('~/common/assets/images/png/add-card.png')}
            resizeMode='cover'
            // borderRadius={7}
            style={{}}
          />
        </View>
        <View style={{flex: 7}}>
          {/* <Text>{'Stripe'}</Text> */}
          <Text style={{ color: '#9f9f9f'}}>
            {`${country} ${brand} XXXX${last4}  ${expMonth}/${expYear}  ${funding}`}
          </Text>
        </View>
        <TouchableOpacity style={{flex: 1, alignItems: 'center'}} onPress={this.onClearCard}>
          <Image source={require('~/common/assets/images/png/remove.png')} />
        </TouchableOpacity>
      </View>
    );
  };

  renderList = () => {
    const { stripePayment, appActions } = this.props;
    const { _t } = appActions;
    const { customer, cardInfo } = stripePayment;
    console.log('===== stripePayment: ', stripePayment);

    return (
      <View>
        <View style={{marginVertical: 10}}>
          <TouchableOpacity>
            <Text style={{ fontSize: 15, color: '#35cdfa'}}>
              {_t('Current method of payment')}
            </Text>
          </TouchableOpacity>
        </View>
        { (cardInfo && cardInfo.cardToken && cardInfo.cardToken.card) && this.renderCardInfo(cardInfo.cardToken.card) }
        { this.renderAddCardItem() }
        { this.renderWhyItem() }
      </View>
    );
  };

  renderAddCardItem = () => {
    const { stripePayment, appActions } = this.props;
    const { _t } = appActions;
    const { customer } = stripePayment;

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginVertical: 20 
        }}
      >
          <View style={{flex: 1, marginRight: 10, alignItems: 'center'}}>
            <Icon name="add" size={30} color="#BFBFC4" />
            {/* <Image
              style={{tintColor: 'gray', backgroundColor: 'white'}}
              source={require('~/common/assets/images/png/plus.png' )}
            /> */}
          </View>
          <View style={{flex: 7, }}>
            <TouchableOpacity onPress={this.addCreditCard}>
              <Text style={{ fontSize: 17, color: '#36384A' }}>
                {customer ? _t('Edit the credit card') : _t('Add a card')}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Image source={require('~/common/assets/images/png/arrow.png')} 
              style={{width: 15, height: 15, tintColor: '#dfdfe6', transform:[{rotate: '180deg'}]}}
            />
          </View>
        </View>
    );
  }

  renderWhyItem = () => {
    const { stripePayment, appActions } = this.props;
    const { _t } = appActions;

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginVertical: 20
        }}
      >
          <View style={{flex: 1, marginRight: 10, alignItems: 'center'}}>
            <Image source={require('~/common/assets/images/menu-help.png' )} />
          </View>
          <View style={{flex: 7, }}>
            <TouchableOpacity onPress={this.onClickWhy}>
              <Text style={{ fontSize: 17, color: '#36384A' }}>
                {_t('Why?')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
    );
  }

  renderActionBar = () => {
    const { _t } = this.props.appActions

    return (
      <View style={{position: 'absolute', left: 10, bottom: 40,width: W-20}}>
        {/* <Button caption={_t('Add a Lydia account')}
          bgColor='#00a0f1' textColor='#fff' borderRadius={15}
          icon={require('~/common/assets/images/png/lydia.png')} iconColor='#fff'
          containerHeight={40}
        />
        <Spacer size={10} />
        <Button caption={_t('Add Apple Pay')}
          bgColor='#36384a' textColor='#fff' borderRadius={15}
          icon={require('~/common/assets/images/png/apple.png')} iconColor='#fff'
          containerHeight={40}
        /> */}
      </View>
    )
  };

  render() {
    const { _t } = this.props.appActions;
    const { showCardForm } = this.state;

    return (
      <ProfileWrapper>
        <ProfileHeader title={_t('Payment')} onPress={this.goBack} />
        {this.renderList()}
        {this.renderActionBar()}

        <Modal
          isVisible={showCardForm}
          animationIn={'slideInRight'}
          animationOut={'slideOutLeft'}
          style={{ margin: 0, }}
        >
          <CardForm onClose={this.handleCloseCardForm} />
        </Modal>
      </ProfileWrapper>
    )
  }
}
