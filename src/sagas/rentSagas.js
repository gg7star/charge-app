import { put, takeLatest, call } from 'redux-saga/effects';
import { Actions } from 'react-native-router-flux';
import { rentActionTypes } from '~/actions/types';

export default function* watcher() {
  yield takeLatest(rentActionTypes.RENT_SUCCESS, rentSuccessProcess);
  yield takeLatest(rentActionTypes.RENT_FAILURE, rentFailedProcess);
  yield takeLatest(rentActionTypes.RENT_RETURNED_BUTTERY, rentReturnButteryProcess);
}

export function* rentSuccessProcess(action) {
  Actions['map_first']({initialModal: 'rent'});
}

export function* rentFailedProcess(action) {
  console.log('==== Go to map_scan_qr');
  Actions['map_scan_qr']()
}

export function* rentReturnButteryProcess(action) {
  console.log('==== Go to admob');
  Actions['admob']({adMode: 'reward'});
}