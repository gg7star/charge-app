import { put, takeEvery, takeLatest, call, delay } from 'redux-saga/effects';
import { Actions } from 'react-native-router-flux';
import * as types from './actionTypes';
import { processRequest } from '~/common/services/api';
import serverUrls from '~/common/constants/api';
import { doPaymentSuccess, doPaymentFailure } from './actions';
import { setGlobalNotification } from '~/root/app/store/actions';

export default function* watcher() {
  yield takeLatest(types.DO_PAYMENT_REQUEST, doPayment)
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
      yield put(setGlobalNotification({message: 'You paid succefully. Thank you!', type: 'success'}));
      Actions['map_first']({initialModal: 'feedback'})
    } else {
      yield put(doPaymentFailure({errorMessage: response.data.message}));
      yield put(setGlobalNotification({message: 'Your payment was failed. Please try later.', type: 'danger'}));
      Actions['map_first']({initialModal: 'rent'})
    }
  } catch(error) {
    console.log('==== doPayment response error: ', error);
    yield put(doPaymentFailure(error.data));
    yield put(setGlobalNotification({message: 'Your payment was failed. Please try later.', type: 'danger'}));
  }
}

export function* getStationDetail(action) {
  try {
    const { phoneNumber } = action.payload;
    const requestPayload = {
      to_telnumber: phoneNumber
    };

    const response = yield call(processRequest, `${serverUrls.apiGatewayServerURL}/mailjet/send_sms`, 'POST', requestPayload);
    let data = {
      confirmCode: response.data.message.verification_code,
      ...response.data,
    }

    if(data.status) {
      yield put(requestConfirmCodeSuccess(data));
    } else {
      yield put(requestConfirmCodeFailed(data));
    }
  } catch(error) {
    yield put(requestConfirmCodeFailed(error.data));
  }
}