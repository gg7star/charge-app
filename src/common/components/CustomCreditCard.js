import React from 'react'
import { TouchableOpacity, View, Text, ScrollView, Image, Linking, StyleSheet, Platform, Alert } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import stripe from 'tipsi-stripe';
import { CreditCardInput } from "react-native-credit-card-input";
import { CardIOModule, CardIOUtilities } from 'react-native-awesome-card-io';
import { Button, ProfileHeader, Spacer } from '~/common/components';
import { W, H, em } from '~/common/constants';

export default class CustomCreditCard extends React.Component {
  state = {
    cardInfo: null,
    doingCreateCardToken: false
  }

  UNSAFE_componentWillMount() {
    if (Platform.OS === 'ios') {
      CardIOUtilities.preload();
    }
  }

  scanCard = () =>{
    CardIOModule
      .scanCard()
      .then(card => {
        // the scanned card
        console.log('==== scanCard: ', card);
        this.CCInput.setValues({
          number: card.cardNumber,
          expiry: `${card.expiryMonth}/${card.expiryYear}`,
          cvc: card.cvv
        });
      })
      .catch((e) => {
        // the user cancelled
        console.log('==== scanCard: error: ', e);
      })
  }

  onClickSiteUrl = () => {
    Linking.openURL('https://nono-chargeme.com/cgu/');
  }

  onChangeCreditCard = (form) => {
    console.log('==== card form: ', form);
    this.setState({cardInfo: form});
  }

  onValidate = () => {
    const { cardInfo } = this.state;
    const { onValidate, appActions } = this.props;
    const { _t } = appActions;

    if (cardInfo && cardInfo.valid) {
      var expiryArray = cardInfo.values.expiry.split('/');
      const params = {
        number: cardInfo.values.number,
        expMonth: parseInt(expiryArray[0]),
        expYear: parseInt(expiryArray[1]),
        cvc: cardInfo.values.cvc
      }
      this.setState({doingCreateCardToken: true});
      const res = stripe.createTokenWithCard(params)
        .then(cardToken => {
          console.log('==== Card created: cardToken', cardToken);
          onValidate && onValidate({cardInfo, cardToken});
          this.setState({doingCreateCardToken: false});
        })
        .catch(error => {
          console.warn('=== Payment failed: ', { error });
          
          Alert.alert(
            _t('Failed to add credit card.'),
            `${error.message}.
${_t('Please input a valid card.')}`,
            [
              {text: _t('Ok'), onPress: () => {
                this.setState({doingCreateCardToken: false});
              }}
            ],
            {cancelable: true},
          );
        });
    }
  }

  render() {
    const { _t } = this.props.appActions;
    const { doingCreateCardToken } = this.state;
    const { onCancel } = this.props;
    return (
      <View>
        <ProfileHeader title={_t('Add a card')} onPress={onCancel} />
        {this.renderContent()}
        <Spinner
          visible={doingCreateCardToken}
          textContent={_t('Checking card...')}
          textStyle={{color: '#FFF'}}
        />
      </View>
    )
  }

  renderContent() {
    const { _t } = this.props.appActions;
    const { cardInfo } = this.state;
    const isValidCard = (cardInfo && cardInfo.valid);

    return (
      <ScrollView style={{ height: H-100 }}>
        <Spacer size={30*em}/>
        <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center', paddingRight: 20 }}>
          <TouchableOpacity
            onPress={this.scanCard}
            style={{ flex: 1, flexDirection: 'row'}}
          >
            <Text style={{color: '#35CDFA', fontWeight: '400', fontSize: 18 }}>{_t('Scan card')}</Text>
            <Image
                source={require('~/common/assets/images/png/camera-enabled.png')} 
                style={{
                  marginLeft: 20, 
                  marginRight: 20,
                  alignItems: 'center'
                }} 
              />
          </TouchableOpacity>
        </View>
        <Spacer size={20*em}/>
        <View style={{ width: '100%' }}>
          <CreditCardInput
            ref={(c) => this.CCInput = c}
            onChange={this.onChangeCreditCard}
            labels={{
              number: _t('Bank card'),
              expiry: _t('Expiration date'),
              cvc: 'CVC/CCV'
            }}
            placeholders={{
              number: '4242 4242 4242 4242',
              expiry: "MM/YY",
              cvc: "..."
            }}
            inputContainerStyle={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderColor: '#e3e3e3',
              fontSize: 17
            }}
            labelStyle={{
              fontSize: 16,
              color: '#9F9F9F',
              fontWeight: '400'
            }}
          />
        </View>
        <View style={{marginLeft: 10, marginRight: 10}}>
          <Text style={{marginTop: 15, fontSize: 14}}> 
            {_t('A bank imprint will be requested as a deposit for each use of our service. In the event of non-compliance with the conditions of use, the company ChargeMe reserves the right to debit the amount of the deposit.')}
          </Text>
          <TouchableOpacity onPress={this.onClickSiteUrl}>
            <Text style={{color: '#35CDFA', textDecorationLine: 'underline'}}> 
              {_t('Learn more about the terms of use.')}
            </Text>
          </TouchableOpacity>
        </View>
        <Spacer size={20*em} />
        <View style={{ alignItems: 'center', marginLeft: 10, marginRight: 10 }}>
          <Button
            onPress={this.onValidate}
            caption={_t('Validate')}
            bgGradientStart={isValidCard ? '#5ED8FC' : '#9F9F9F'}
            bgGradientEnd={isValidCard ? '#5ED8FC' : '#9F9F9F'}
            textColor='#FFFFFF'
            disabled={!isValidCard}
          />
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  field: {
    width: '100%',
    color: '#449aeb',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
  }
})
