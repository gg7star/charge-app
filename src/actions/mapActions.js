import { mapActionTypes } from './types';

const types = mapActionTypes;

export function initMap() {
  return {
    type: types.MAP_INIT
  }
}

export function changedCurrentLocation(position) {
  return {
    type: types.CHANGED_CURRENT_LOCATION,
    payload: {currentLocation: position}
  }
}

export function loadPlacesOnMap() {
  return {
    type: types.LOAD_PLACES_ON_MAP_REQUEST
  }
}

export function searchPlaces(searchVal, currentLocation, radius) {
  return {
    type: types.SEARCH_PLACES_REQUEST,
    payload: { searchVal, currentLocation, radius }
  }
}

export function selectPlace(index, place) {
  return {
    type: types.SELECT_PLACE,
    payload: { index, place }
  }
}

export function setDirection({distance, duration}) {
  return {
    type: types.SET_DIRECTION,
    payload: {direction: {distance, duration}}
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

export function scannedQrCode(qrCode) {
  return {
    type: types.SCANNED_QR_CODE,
    payload: {
      scannedQrCode: qrCode
    }
  }
}

export function setActiveModal(name) {
  return {
    type: types.ACTIVE_MODAL,
    payload: {
      activeModal: name
    }
  }
}

export function setViewedAdmob(viewedAdmob) {
  return {
    type: types.VIEWED_ADMOB,
    payload: {viewedAdmob}
  }
}