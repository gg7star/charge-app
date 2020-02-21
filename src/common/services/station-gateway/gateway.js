import { Actions } from 'react-native-router-flux';
import { processRequest } from '~/common/services/api';
import serverUrls from '~/common/constants/api';
import { AppActions, RentActions } from '~/actions';
import { rentActionTypes } from '~/actions/types';
import * as notifications from '~/common/services/onesignal/notifications';
import { saveHistory } from '~/common/services/rn-firebase/database';

const { rentFailure } = RentActions;

export async function rentButtery(data, auth) {
  const { sstationSn, uuid, pushToken, deviceType, onesignalUserId } = data;
  // const data = {
  //   stationSn: stationSn,
  //   tradeNo: tradeNo,
  //   slotNum: slotNum,
  //   pushToken: auth.fcm.token,
  //   uuid: auth.credential.user.uid,
  //   onesignalUserId: auth.oneSignalDevice.userId
  // }
  try {
    const response = await processRequest(
      `${serverUrls.apiGatewayServerURL}/rental/lend_cabinet`,
      'POST',
      data
    );
    console.log('==== rentButtery: response: ', response);
    if (response.data.code != 200) {
      return { error: response.data.code, errorMessage: '', data: null };
    }
    return { data: response.data, error: null, errorMessage: null };
  } catch(error) {
    console.log('==== rent response error: ', error);
    return { data: null, error: error.status, errorMessage: error.statusText };
  }
}

export async function returnButtery(rent, auth) {
  const { stationSn, powerBankSn, tradeNo, slotNum } = rent;
  const data = {
    stationSn: stationSn,
    tradeNo: tradeNo,
    slotNum: slotNum,
    pushToken: auth.fcm.token,
    uuid: auth.credential.user.uid,
    onesignalUserId: auth.oneSignalDevice.userId
  }
  try {
    // Get a butterry
    const response = await processRequest(
      `${serverUrls.apiGatewayServerURL}/rental/return_powerbank`,
      'POST',
      data
    );
    console.log('==== returnButtery: response: ', response);
    if (response.data.code != 200) {
      return { error: response.data.code, errorMessage: '', data: null };
    }
    return { data: response.data, error: null, errorMessage: null };
  } catch(error) {
    console.log('==== return response error: ', error);
    return { data: null, error: error.status, errorMessage: error.data.error };
  }
}