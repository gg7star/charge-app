import { put, takeLatest, call } from 'redux-saga/effects';
import { Actions } from 'react-native-router-flux';
import { processRequest } from '~/common/services/api';
import serverUrls from '~/common/constants/api';
import { AppActions, StripeActions, MapActions, RentActions } from '~/actions';
import { stripeActionTypes } from '~/actions/types';
import { saveCreditCard, saveHistory } from '~/common/services/rn-firebase/database';
import * as notifications from '~/common/services/onesignal/notifications';
import MAP_MODAL from '~/common/constants/map';

const {
  doPaymentSuccess,
  doPaymentFailure,
  registerCardSuccess,
  registerCardFailure
} = StripeActions;
const { setActiveModal } = MapActions;
const { setGlobalNotification } = AppActions;
const { requireFeedback } = RentActions;

export default function* watcher() {
  yield takeLatest(stripeActionTypes.REGISTER_CARD_REQUEST, saveCardInfo);
  yield takeLatest(stripeActionTypes.DO_PAYMENT_REQUEST, doPayment);
}

export function* doPayment(action) {
  try {
    const { data, auth } = action.payload;
    console.log('==== data: ', data);
    console.log('===== auth: ', auth);
    // Get a list of all stationSn
    const response = yield call(
      processRequest,
      `${serverUrls.apiGatewayServerURL}/payment/stripe/checkout`,
      'POST',
      data
    );
    if (response.data.status === 200) {
      yield put(doPaymentSuccess(response.data));
      // Send notification
      var contents = {
        'en': `You paid to buy a buttery in ${data.stationSn}, succefully. Traditional number is ${data.tradeNo}.`,
        'fr': `Vous avez payé pour acheter un beurre dans ${data.stationSn}, avec succès. Le nombre traditionnel est ${data.tradeNo}.`
      }
      var message = { 
        type: notifications.NONO_NOTIFICATION_TYPES.PAIED_TO_NONO
      };
      var otherParameters = {
        headings: {
          "en": "Payment",
          "fr": "Paiement"
        },
      }
      if (auth && auth.oneSignalDevice && auth.oneSignalDevice.userId) {
        notifications.postNotification(
          contents, message, 
          auth.oneSignalDevice.userId, otherParameters
        );
      }
      yield put(requireFeedback());
      Actions['map_first']();
    } else {
      yield put(doPaymentFailure({errorMessage: response.data.message}));
      // Send notification
      var contents = {
        'en': `Your payment was failed to buy a buttery in ${data.stationSn}. Traditional number is ${data.tradeNo}.`,
        'fr': `Votre paiement n'a pas pu acheter un beurre en ${data.stationSn}. Le nombre traditionnel est ${data.tradeNo}.`
      }
      var message = { 
        type: notifications.NONO_NOTIFICATION_TYPES.PAIED_TO_NONO
      };
      var otherParameters = {
        headings: {
          "en": "Payment",
          "fr": "Paiement"
        },
      }
      if (auth && auth.oneSignalDevice && auth.oneSignalDevice.userId) {
        notifications.postNotification(
          contents, message, 
          auth.oneSignalDevice.userId, otherParameters
        );
      }
      Actions['map_first']();
    }
  } catch(error) {
    console.log('==== doPayment response error: ', error);
    yield put(doPaymentFailure(error.data));
    // yield put(setGlobalNotification({message: 'Your payment was failed. Please try later.', type: 'danger'}));
  }
}

export function* saveCardInfo(action) {
  try {
    // Get a list of all stationSn
    console.log('===== calling saveCardInfo: ', action);
    const { customer, auth } = action.payload;
    const response = yield call(
      processRequest,
      `${serverUrls.apiGatewayServerURL}/payment/stripe/save_card`,
      'POST',
      customer
    );

    if (response.data.status === 200) {
      const customer = response.data.data;
      const cardInfo = customer.sources.data[0];
      const {brand, exp_month, exp_year, funding, last4} = cardInfo;

      // Send notification
      var contents = {
        'en': `Your credt xxxx${last4} card was registered successfully.`,
        'fr': `Votre carte de crédit xxxx${last4} a bien été enregistrée.`
      }
      var message = { 
        type: notifications.NONO_NOTIFICATION_TYPES.CONNECTED_CARD
      };
      var otherParameters = {
        headings: {
          "en": "Credit Card",
          "fr": "Carte de crédit"
        },
      }
      if (auth && auth.oneSignalDevice && auth.oneSignalDevice.userId) {
        notifications.postNotification(
          contents, message, 
          auth.oneSignalDevice.userId, otherParameters
        );
      }
      
      yield put(registerCardSuccess(customer));
      yield call(saveCreditCard, customer);
      Actions['map_scan_qr']();
    } else {
      yield put(registerCardFailure({errorMessage: response.data.message}));
      // yield put(setGlobalNotification({
      //   message: 'Your card was failed to save. Please try later.',
      //   type: 'danger'}
      // ));
    }
  } catch(error) {
    console.log('==== doPayment response error: ', error);
    yield put(registerCardFailure(error.data));
    // yield put(setGlobalNotification({message: 'Your card was failed to save. Please try later.', type: 'danger'}));
  }
}
