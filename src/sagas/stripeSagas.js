import { put, takeLatest, call } from 'redux-saga/effects';
import { Actions } from 'react-native-router-flux';
import { processRequest } from '~/common/services/api';
import serverUrls from '~/common/constants/api';
import { AppActions, StripeActions } from '~/actions';
import { stripeActionTypes } from '~/actions/types';

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
    console.log('===== calling saveCardInfo')
    const response = yield call(
      processRequest,
      `${serverUrls.apiGatewayServerURL}/payment/stripe/save_card`,
      'POST',
      action.payload
    );
    if (response.data.status === 200) {
      yield put(registerCardSuccess(response.data.data));
      // yield put(setGlobalNotification({
      //   message: 'You saved card info succefully. Thank you!',
      //   type: 'success'
      // }));
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
