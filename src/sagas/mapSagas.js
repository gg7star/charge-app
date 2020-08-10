import { put, takeLatest, call } from 'redux-saga/effects';
import { mapFirebaseService } from '~/common/services/firebase';
import { getPlances, searchPlances } from '~/common/services/rn-firebase/database';
import { mapActionTypes } from '~/actions/types';
import { processRequest } from '~/common/services/api';
import serverUrls from '~/common/constants/api';
import { MapActions } from '~/actions';

const {
  requestGetAllStationsSuccess,
  requestGetAllStationsFailure,
  receivedStationDetail
} = MapActions;

export default function* watcher() {
  // yield takeLatest(types.SEARCH_PLACES_REQUEST, doSearch)
  yield takeLatest(mapActionTypes.LOAD_PLACES_ON_MAP_REQUEST, loadPlacesOnMap);
  yield takeLatest(mapActionTypes.GET_ALL_STATIONS, getAllStations);
  yield takeLatest(mapActionTypes.GET_STATION_DETAIL, getStationDetail);
  yield takeLatest(mapActionTypes.SELECT_PLACE, selectPlace);
}

export function* loadPlacesOnMap(action) {
  // // Get places from firebase
  // try {
  //   const places = yield call(getPlances);
  //   yield put({ type: mapActionTypes.LOAD_PLACES_ON_MAP_SUCCESS, payload: { places } })
  // } catch(e) {
  //   console.log('====== error: ', e);
  //   yield put({ type: mapActionTypes.LOAD_PLACES_ON_MAP_FAILURE })
  // }

  // Get places from API gateway
  try {
    // Get a list of all stationSn
    const response = yield call(
      processRequest,
      `${serverUrls.apiGatewayServerURL}/place/all`,
      'GET',
      null
    );
    const places = response.data;
    yield put({ type: mapActionTypes.LOAD_PLACES_ON_MAP_SUCCESS, payload: { places } })
  } catch(error) {
    console.log('====== Get places: error: ', error);
    yield put({ type: mapActionTypes.LOAD_PLACES_ON_MAP_FAILURE })
  }
}

export function* getAllStations(action) {
  try {
    // Get a list of all stationSn
    const response = yield call(
      processRequest,
      `${serverUrls.apiGatewayServerURL}/rental/cabinet_list`,
      'POST',
      null
    );
    const stationSnList = response.data.stationSnList;
    yield put(requestGetAllStationsSuccess(stationSnList));
    // Get detail info of all stations
    for(var i = 0; i < stationSnList.length; i++) {
      const stationSnData = stationSnList[i]
      const responseStation = yield call(
        processRequest,
        `${serverUrls.apiGatewayServerURL}/rental/cabinet_info`,
        'POST', stationSnData
      );
      console.log('==== responseStation: ', responseStation);
      if (responseStation.data.code === "200") {
        yield put(receivedStationDetail(responseStation.data.body[0]));
      } else {
        console.log('==== Failed to get stationSN: ', stationSnList[i])
      }
    }
  } catch(error) {
    console.log('==== getAllStations response error: ', error);
    yield put(requestGetAllStationsFailure(error ? error.data : ''));
  }
}

export function* getStationDetail(action) {
  try {
    const { phoneNumber } = action.payload;
    const requestPayload = {
      to_telnumber: phoneNumber
    };

    const response = yield call(
      processRequest,
      `${serverUrls.apiGatewayServerURL}/mailjet/send_sms`,
      'POST',
      requestPayload
    );
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

export function* selectPlace(action) {
  try {
    const { place } = action.payload;
    if (place === null) return;
    const { stations } = place;
    if (stations === null) return
    for (var i = 0; i < stations.length; i++) {
      const stationSnData = {
        stationSn: stations[i]
      }
      const responseStation = yield call(
        processRequest,
        `${serverUrls.apiGatewayServerURL}/rental/cabinet_info`,
        'POST', stationSnData
      );
      console.log('==== responseStation: ', responseStation);
      if (responseStation.data.code === "200") {
        yield put(receivedStationDetail(responseStation.data.body[0]));
      } else {
        console.log('==== Failed to get stationSN: ', stationSnList[i])
      }
    }
  } catch (error) {
    console.log('===== selectPlace: error: ', error);
  }
  
}