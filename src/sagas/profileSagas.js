import { put, takeLatest, call } from 'redux-saga/effects';
import { Actions } from 'react-native-router-flux';
import { profileFirebaseService } from '~/common/services/firebase';
import { profileActionTypes } from '~/actions/types';
import { loadHistories, saveNotification, loadNotifications } from '~/common/services/rn-firebase/database';

export default function* watcher() {  
  yield takeLatest(profileActionTypes.ADD_COUPON_REQUEST, addCoupon);
  yield takeLatest(profileActionTypes.LOAD_HISTORY_REQUEST, loadHistoriesProcess);
  yield takeLatest(profileActionTypes.ADD_NOTIFICATION, saveNotificationProcess);
  yield takeLatest(profileActionTypes.LOAD_NOTIFICATION_REQUEST, loadNotificationsProcess);
}

export function* addCoupon(action) {
  const { couponCode } = action.payload;

  try {
    profileFirebaseService.addCoupon({ couponCode });
    yield put({ type: profileActionTypes.ADD_COUPON_SUCCESS, payload: { couponCode } });
    Actions['profile_wallet']();
  } catch (e) {
    yield put({ type: profileActionTypes.ADD_COUPON_FAILURE });
  }
}

export function* loadHistoriesProcess(action) {
  try {
    const histories = yield call(loadHistories);
    yield put({ type: profileActionTypes.LOAD_HISTORY_SUCCESS, payload: { histories } });
  } catch (e) {
    console.log('======= error: loadHistoriesProcess: ', e);
    yield put({ type: profileActionTypes.LOAD_HISTORY_FAILURE });
  }
}

export function* saveNotificationProcess(action) {
  const { notification } = action.payload;

  try {
    yield call(saveNotification, notification);
  } catch (e) {
    console.log('======= error: saveNotification: ', e);
  }
}

export function* loadNotificationsProcess(action) {
  try {
    const notifications = yield call(loadNotifications);
    yield put({ type: profileActionTypes.LOAD_NOTIFICATION_SUCCESS, payload: { notifications } });
  } catch (e) {
    console.log('======= error: loadNotificationsProcess: ', e);
    yield put({ type: profileActionTypes.LOAD_NOTIFICATION_FAILURE });
  }
}