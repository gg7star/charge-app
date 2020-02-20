import { put, takeLatest, call } from 'redux-saga/effects';
import { Actions } from 'react-native-router-flux';
import { processRequest } from '~/common/services/api';
import serverUrls from '~/common/constants/api';
import { AppActions, RentActions } from '~/actions';
import { rentActionTypes } from '~/actions/types';
import * as notifications from '~/common/services/onesignal/notifications';
import { saveHistory } from '~/common/services/rn-firebase/database';

const { rentFailure } = RentActions;
const { setGlobalNotification } = AppActions;

export default function* watcher() {
  // yield takeLatest(rentActionTypes.RENT_REQUEST, rentStationProcess);
  yield takeLatest(rentActionTypes.RENT_SUCCESS, rentSuccessProcess);
  yield takeLatest(rentActionTypes.RENT_RETURNED_BUTTERY, rentReturnButteryProcess);
}

// export function* rentStationProcess(action) {
//   try {
//     // Get a list of all stationSn
//     const response = yield call(
//       processRequest,
//       `${serverUrls.apiGatewayServerURL}/rental/lend_cabinet`,
//       'POST',
//       action.payload
//     );
//     console.log('==== rentStationProcess: response: ', response);
//     if (response.data.code != 200) {
//       yield put(rentFailure(response.data.msg));
//       yield put(setGlobalNotification({
//         message: 'You can\'t rent this device. Please try later.',
//         type: 'danger'}
//       ));
//       Actions['map_first']();
//     }
//   } catch(error) {
//     console.log('==== rent response error: ', error);
//     yield put(rentFailure(error.data));
//     yield put(setGlobalNotification({
//       message: 'You can\'t rent this device. Please try later.',
//       type: 'danger'}
//     ));
//     Actions['map_first']();
//   }
// }

export function* rentSuccessProcess(action) {
  const { powerBankSn, slotNum, auth } = action.payload;
  // Send notification
  var contents = {
    'en': `You rented a buttery. powerBank: ${powerBankSn}, slotNumber: ${slotNum}`,
    'fr': `Vous avez loué un beurre. powerBank: ${powerBankSn}, slotNumber: ${slotNum}`
  };
  var message = {
    type: notifications.NONO_NOTIFICATION_TYPES.RENT_BUTTERY
  };
  var otherParameters = {
    headings: {
      "en": "Rent buttery",
      "fr": "Louer beurre"
    },
  };
  if (auth && auth.oneSignalDevice && auth.oneSignalDevice.userId) {
    notifications.postNotification(
      contents, message, 
      auth.oneSignalDevice.userId, otherParameters
    );
  }

  Actions['map_first']({initialModal: 'rent'});
}

export function* rentReturnButteryProcess(action) {
  const { rent, auth } = action.payload;
  const { powerBankSn, slotNum } = rent;
  // Send notification
  var contents = {
    'en': `You returned the buttery. powerBank: ${powerBankSn}, slotNumber: ${slotNum}`,
    'fr': `Vous avez rendu le beurre. powerBank: ${powerBankSn}, slotNumber: ${slotNum}`
  };
  var message = {
    type: notifications.NONO_NOTIFICATION_TYPES.RETURNED_BATTERY
  };
  var otherParameters = {
    headings: {
      "en": "Returned buttery",
      "fr": "Beurre retourné"
    },
  };
  if (auth && auth.oneSignalDevice && auth.oneSignalDevice.userId) {
    notifications.postNotification(
      contents, message, 
      auth.oneSignalDevice.userId, otherParameters
    );
  }
  // Save history
  const history = {
    date: rent.starTime,
    price: "15.6€",
    duration: "30 min",
    takePlace: "79 Rue de seins.sadsa",
    depositPlace: "155 Bouelvard Saint Gernmarenw",
    cost: 15.60,
    credit: 0,
    points: 123
  };
  yield call(saveHistory, history);
}