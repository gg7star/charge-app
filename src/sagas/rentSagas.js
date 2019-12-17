import { put, takeLatest, call } from 'redux-saga/effects';
import { Actions } from 'react-native-router-flux';
import { processRequest } from '~/common/services/api';
import serverUrls from '~/common/constants/api';
import { AppActions, RentActions } from '~/actions';
import { rentActionTypes } from '~/actions/types';

const { rentFailure } = RentActions;
const { setGlobalNotification } = AppActions;

export default function* watcher() {
  yield takeLatest(rentActionTypes.RENT_REQUEST, rentStationProcess);
}

export function* rentStationProcess(action) {
  try {
    // Get a list of all stationSn
    const response = yield call(
      processRequest,
      `${serverUrls.apiGatewayServerURL}/rental/lend_cabinet`,
      'POST',
      action.payload
    );
    if (response.data.code != 200) {
      yield put(rentFailure(response.data.msg));
      yield put(setGlobalNotification({
        message: 'You can\'t rent this device. Please try later.',
        type: 'danger'}
      ));
      Actions['map_first']();
    }
  } catch(error) {
    console.log('==== rent response error: ', error);
    yield put(rentFailure(response.data.msg));
    yield put(setGlobalNotification({
      message: 'You can\'t rent this device. Please try later.',
      type: 'danger'}
    ));
    Actions['map_first']();
  }
}