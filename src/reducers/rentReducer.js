import { rentActionTypes } from '~/actions/types';
import { Actions } from 'react-native-router-flux';
import moment from 'moment';

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
  slotNum: 0,
  msg: 0,
  // check doing
  isFetching: false,
  statusMessage: '',
  startTime: null,
  endTime: null
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
        isRented: false,
        stationSn: action.payload.stationSn,
        uuid: action.payload.uuid,
        pushToken: action.payload.pushToken,
        deviceType: action.payload.deviceType,
        onesignalUserId: action.payload.onesignalUserId,
        isFetching: true,
        statusMessage: 'During rent device...'
      }
    case rentActionTypes.RENT_SUCCESS:
        return {
          ...state,
          isRented: true,
          isFetching: false,
          tradeNo: action.payload.tradeNo,
          powerBankSn: action.payload.powerBankSn,
          slotNum: action.payload.slotNum,
          msg: action.payload.msg,
          statusMessage: 'rented this device.',
          startTime: moment().format('DD/MM/YY LT'),
          endTime: null
        }
    case rentActionTypes.RENT_FAILURE:
      return {
        ...state,
        isRented: false,
        isFetching: false,
        statusMessage: action.payload.statusMessage
      }
    case rentActionTypes.RENT_RETURNED_BUTTERY:
      return {
        ...state,
        isRented: false,
        isFetching: false,
        endTime: moment().format('DD/MM/YY LT')
      }
    default: 
      return state
  }
}
