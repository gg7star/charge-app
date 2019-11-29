import { put, takeEvery, takeLatest, call, delay } from 'redux-saga/effects';
import * as gmapService from '../common/services/gmap';
import * as firebaseService from '../common/services/firebase';
import * as types from './actionTypes'
import { processRequest } from '../../../common/services/api';
import serverUrls from '../../../common/constants/api';
import {
  requestGetAllStationsSuccess,
  requestGetAllStationsFailure,
  receivedStationDetail
} from './actions'

export default function* watcher() {
  // yield takeLatest(types.SEARCH_PLACES_REQUEST, doSearch)
  yield takeLatest(types.LOAD_PLACES_ON_MAP_REQUEST, loadPlacesOnMap)
  yield takeLatest(types.GET_ALL_STATIONS, getAllStations)
  yield takeLatest(types.GET_STATION_DETAIL, getStationDetail)
}

export function* loadPlacesOnMap(action) {
  try {
    const places = yield call(firebaseService.getPlances);
    console.log('===== places: ', places);
    // For test
    const currentLocation = {
      name: "My location",
      coordinate: {
        latitude: 37.332096988,
        longitude: -122.0487472123455
      }
    };
    yield put({ type: types.LOAD_PLACES_ON_MAP_SUCCESS, payload: { currentLocation, places } })
  } catch(e) {
    console.log('====== error: ', e);
    yield put({ type: types.LOAD_PLACES_ON_MAP_FAILURE })
  }  
}

// export function* doSearch(action) {
//   try {
//     const { searchedPlaces } = gmapService.searchPlaces()
//     console.log('qwe===weq=we=q')
//     console.log(searchedPlaces)
    
//     yield put({ type: types.SEARCH_PLACES_SUCCESS, payload: { searchedPlaces } })
//   } catch(e) {
//     yield put({ type: types.SEARCH_PLACES_FAILURE })
//   }  
// }

export function* getAllStations(action) {
  try {
    // Get a list of all stationSn
    const response = yield call(processRequest, `${serverUrls.apiGatewayServerURL}/rental/cabinet_list`, 'POST', null);
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
    yield put(requestGetAllStationsFailure(error.data));
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