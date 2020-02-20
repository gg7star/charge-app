import { put, takeLatest, call } from 'redux-saga/effects';
import { Actions } from 'react-native-router-flux';
import { processRequest } from '~/common/services/api';
import serverUrls from '~/common/constants/api';
import { AppActions, StripeActions } from '~/actions';
import { stripeActionTypes } from '~/actions/types';
import { saveCreditCard } from '~/common/services/rn-firebase/database';
import * as notifications from '~/common/services/onesignal/notifications';

const {
  doPaymentSuccess,
  doPaymentFailure,
  registerCardSuccess,
  registerCardFailure
} = StripeActions;
const { setGlobalNotification } = AppActions;

export default function* watcher() {
  yield takeLatest(stripeActionTypes.REGISTER_CARD_REQUEST, saveCardInfo);
  yield takeLatest(stripeActionTypes.DO_PAYMENT_REQUEST, doPayment);
}

export function* doPayment(action) {
  try {
    // Get a list of all stationSn
    const response = yield call(
      processRequest,
      `${serverUrls.apiGatewayServerURL}/payment/stripe/checkout`,
      'POST',
      action.payload
    );
    if (response.data.status === 200) {
      yield put(doPaymentSuccess(response.data));
      yield put(setGlobalNotification({
        message: 'You paid succefully. Thank you!',
        type: 'success'
      }));
      Actions['map_first']({initialModal: 'feedback'});
    } else {
      yield put(doPaymentFailure({errorMessage: response.data.message}));
      yield put(setGlobalNotification({
        message: 'Your payment was failed. Please try later.',
        type: 'danger'}
      ));
      Actions['map_first']({initialModal: 'rent'});
    }
  } catch(error) {
    console.log('==== doPayment response error: ', error);
    yield put(doPaymentFailure(error.data));
    yield put(setGlobalNotification({message: 'Your payment was failed. Please try later.', type: 'danger'}));
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
        'fr': `Vous êtes d\'abord enregistré avec votre compte Facebook.`
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
      yield put(setGlobalNotification({
        message: 'Your card was failed to save. Please try later.',
        type: 'danger'}
      ));
    }
  } catch(error) {
    console.log('==== doPayment response error: ', error);
    yield put(registerCardFailure(error.data));
    yield put(setGlobalNotification({message: 'Your card was failed to save. Please try later.', type: 'danger'}));
  }
}
