import { rentActionTypes } from '~/actions/types';
import { Actions } from 'react-native-router-flux';
import moment from 'moment';
import { RENT_STATUS } from '~/common/constants/rent';

const initialState = {
  isRented: false,
  // entered data
  stationSn: null,
  uuid: null,
  pushToken: null,
  deviceType: null,
  // callback data
  tradeNo: null,
  powerBankSn: null,
  slotNum: -1,
  msg: 0,
  enabledDeposit: false,
  stationNo: null,
  rentedPlaceAddress: null,
  returnedPlaceAddress: null,
  // check doing
  isFetching: false,
  statusMessage: '',
  startTime: null,
  endTime: null,
  rentStatus: RENT_STATUS.INIT
}

export default function reducer(state = initialState, action) {
  switch(action.type) {
    case rentActionTypes.RENT_INIT:
      return {
        ...initialState
      }
    case rentActionTypes.RENT_REQUEST:
      return {
        ...state,
        rentStatus: RENT_STATUS.RENT_REQUEST,
        isRented: false,
        stationSn: action.payload.stationSn,
        uuid: action.payload.uuid,
        pushToken: action.payload.pushToken,
        deviceType: action.payload.deviceType,
        onesignalUserId: action.payload.onesignalUserId,
        isFetching: true,
        tradeNo: null,
        powerBankSn: null,
        slotNum: -1,
        statusMessage: 'During rent device...',
        enabledDeposit: false,
      }
    case rentActionTypes.RENT_SUCCESS:
        return {
          ...state,
          rentStatus: RENT_STATUS.RENTED,
          isRented: true,
          isFetching: false,
          tradeNo: action.payload.tradeNo,
          powerBankSn: action.payload.powerBankSn,
          slotNum: action.payload.slotNum,
          stationSn:  action.payload.stationSn,
          msg: action.payload.msg,
          statusMessage: 'rented this device.',
          startTime: moment().format('DD/MM/YY LTS'),
          rentedPlaceAddress: action.payload.rentedPlaceAddress,
          endTime: null,
          enabledDeposit: false,
        }
    case rentActionTypes.RENT_FAILURE:
      return {
        ...initialState,
        rentStatus: RENT_STATUS.RENT_FAILED,
        statusMessage: action.payload.statusMessage
      }
    case rentActionTypes.RENT_RETURNED_BATTERY:
      return {
        ...state,
        ...action.payload.rent,
        // returnedPlaceAddress: action.payload.rent.returnedPlaceAddress,
        rentStatus: RENT_STATUS.RETURNED,
        isRented: false,
        isFetching: false,
        enabledDeposit: true,
        endTime: moment().format('DD/MM/YY LTS'),
        // stationSn: action.payload.rent.stationNo
      }
    case rentActionTypes.RENT_REQUIRED_FEEDBACK:
      return {
        ...state,
        rentStatus: RENT_STATUS.REQUIRED_FEEDBACK
      }
    default: 
      return state
  }
}
