import { mapActionTypes } from '~/actions/types';

const initialState = {
  places: {},
  currentLocation: null,
  searchedPlaces: [],
  place: null,
  searchLimit: '1km',
  stations: [],
  scannedQrCode: ''
}

export default function reducer(state = initialState, action) {
  switch(action.type) {    
    case mapActionTypes.LOAD_PLACES_ON_MAP_SUCCESS:
      return {
        ...state,
        currentLocation: action.payload.currentLocation,
        places: action.payload.places
      }
    case mapActionTypes.SEARCH_PLACES_REQUEST:
      const searchVal = action.payload.searchVal;
      var searchedPlaces = []; 
      Object.keys(state.places).map((key, index) => {
        const place = state.places[key];
        if (place.name.toLowerCase().search(searchVal.toLowerCase()) > -1 || 
          key.toLowerCase().search(searchVal.toLowerCase()) > -1
        ) {
          searchedPlaces.push(place);
        }
      });
      return {
        ...state,
        searchedPlaces
      }
    case mapActionTypes.SEARCH_PLACES_SUCCESS:
      return {
        ...state,
        searchedPlaces: action.payload.searchedPlaces
      }
    case mapActionTypes.SELECT_PLACE:
      return {
        ...state,
        place: state.searchedPlaces[action.payload.index]
      }
    case mapActionTypes.GET_ALL_STATIONS:
      return {
        ...state,
      }
    case mapActionTypes.GET_ALL_STATIONS_SUCCESS:
      return {
        ...state,
        ...action.payload
      }
    case mapActionTypes.GET_ALL_STATIONS_FAILURE:
        return {
          ...state,
          ...action.payload
        }
    case mapActionTypes.GET_STATION_DETAIL:
      return {
        ...state,
        station: state.places[action.payload.stationSn]
      }
    case mapActionTypes.RECEIVED_STATION_DETAIL:
      var stations = state.stations;
      const index = stations.findIndex((station) => station.stationSn === action.payload.station.stationSn);
      if (index > -1) {
        stations.splice(index, 1);
      } else {
        stations.push(action.payload.station)
      }
      return {
        ...state,
        stations
      }
    case mapActionTypes.SCANNED_QR_CODE:
      return {
        ...state,
        scannedQrCode: action.payload.scannedQrCode
      }
    default:
      return state
  }
}
