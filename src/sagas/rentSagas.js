import { put, takeLatest, call } from 'redux-saga/effects';
import { Actions } from 'react-native-router-flux';
import { rentActionTypes } from '~/actions/types';
import MAP_MODAL from '~/common/constants/map';
import admobConfig from '~/common/config/admob';
import { MapActions } from '~/actions';
const { setActiveModal, setViewedAdmob } = MapActions;

export default function* watcher() {
  yield takeLatest(rentActionTypes.RENT_SUCCESS, rentSuccessProcess);
  yield takeLatest(rentActionTypes.RENT_FAILURE, rentFailedProcess);
  yield takeLatest(rentActionTypes.RENT_RETURNED_BATTERY, rentReturnButteryProcess);
}

export function* rentSuccessProcess(action) {
  yield put(setActiveModal(MAP_MODAL.RENT));
  yield put(setViewedAdmob(false));
  // Actions['map_first']({initialModal: 'rent'});
}

export function* rentFailedProcess(action) {
  console.log('==== Go to map_scan_qr');
  yield put(setActiveModal(MAP_MODAL.UNLOCK));
  yield put(setViewedAdmob(false));
  Actions['map_scan_qr']();
}

export function* rentReturnButteryProcess(action) {
  console.log('==== Go to admob');
  // yield put(setActiveModal(MAP_MODAL.FEEDBACK));
  yield put(setViewedAdmob(false));
  Actions['admob']({adMode: admobConfig.defaultAdMob});
}