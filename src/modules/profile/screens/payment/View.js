import React from 'react'
import { TouchableOpacity, View, Text, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import ProfileWrapper from '../../common/wrappers/ProfileWrapper'
import { ProfileHeader } from '~/common/components';
import { W, H, em } from '~/common/constants';
import { Button, Spacer } from '~/common/components';

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
  };

  goBack = () => {
    Actions.map();
    Actions['map_first']({profileOpened: true});
  }

  addCreditCard = () => {
    const { auth, profileActions, stripeActions } = this.props;
    Actions['profile_payment_card']();
  };

  onClearCard = () => this.props.stripeActions.initStripe();

  renderCardInfo = (cardInfo) => {
    // const cardInfo = customer.sources.data[0];
    const {brand, country, expMonth, expYear, funding, last4} = cardInfo;
    return (
      <View style={{ flexDirection: 'row', marginVertical: 20 }}>
        <View style={{flex: 1, marginRight: 10}}>
          <Image
            source={require('~/common/assets/images/stripe.jpeg')}
            resizeMode='cover'
            borderRadius={7}
            style={{width:35, height: 35}}
          />
        </View>
        <View style={{flex: 7}}>
          <Text>{'Stripe'}</Text>
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
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
          <View style={{flex: 1, marginRight: 10, alignItems: 'center'}}>
            <Image source={require('~/common/assets/images/png/add-card.png' )} />
          </View>
          <View style={{flex: 7, }}>
            <TouchableOpacity onPress={this.addCreditCard}>
              <Text style={{ fontSize: 16 }}>
                {customer ? _t('Edit a credit card') : _t('Add a credit card')}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Image source={require('~/common/assets/images/png/arrow.png')} 
              style={{width: 15, height: 15, tintColor: '#dfdfe6', transform:[{rotate: '180deg'}]}}
            />
          </View>
        </View>
      </View>
    )
  };

  renderActionBar = () => {
    const { _t } = this.props.appActions

    return (
      <View style={{
        position: 'absolute', left: 10, bottom: 40,
        width: W-20,        
      }}>
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

    return (
      <ProfileWrapper>
        <ProfileHeader title={_t('Payment')} onPress={this.goBack} />
        {this.renderList()}
        {this.renderActionBar()}
      </ProfileWrapper>
    )
  }
}
