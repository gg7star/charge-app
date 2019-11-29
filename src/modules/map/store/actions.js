import * as types from './actionTypes'

export function loadPlacesOnMap() {
  return {
    type: types.LOAD_PLACES_ON_MAP_REQUEST
  }
}

export function searchPlaces(searchVal) {
  return {
    type: types.SEARCH_PLACES_REQUEST,
    payload: { searchVal }
  }
}

export function selectPlace(index) {
  return {
    type: types.SELECT_PLACE,
    payload: { index }
  }
}

export function getAllStations() {
  return {
    type: types.GET_ALL_STATIONS,
  }
}

export function getStationDetail(stationSn) {
  return {
    type: types.GET_STATION_DETAIL,
    payload: { stationSn }
  }
}

export function requestGetAllStationsSuccess(stationSnList) {
  return {
    type: types.GET_ALL_STATIONS_SUCCESS,
    payload: {
      stationSnList,
      error: false
    }
  }
}

export function requestGetAllStationsFailure(data) {
  return {
    type: types.GET_ALL_STATIONS_FAILURE,
    payload: {
      error: data
    }
  }
}

export function receivedStationDetail(station) {
  return {
    type: types.RECEIVED_STATION_DETAIL,
    payload: {
      station
    }
  }
}

export function scannedQrCode(scannedQrCode) {
  return {
    type: types.SCANNED_QR_CODE,
    payload: {
      scannedQrCode
    }
  }
}