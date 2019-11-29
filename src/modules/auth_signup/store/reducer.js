import * as types from './actionTypes';

const initialState = {
  isFetching: false,
  statusMessage: '',
  statusMessageType: '',
  countryCode: '',
  phoneNumber: '',
  confirmCode: '',
  name: '',
  email: '',
  birthday: '',
  isFacebookSigup: false,
}

export default function reducer(state = initialState, action) {
  switch(action.type) {
    case types.SET_PHONE_NUMBER: 
      return {
        ...state,
        countryCode: action.payload.countryCode,
        phoneNumber: action.payload.phoneNumber,
        isFetching: true
      }
    case types.REQUEST_CONFIRM_CODE_SUCCESS:
      return {
        ...state,
        confirmCode: action.payload.confirmCode,
        data: action.payload.data,
        isFetching: false
      }
    case types.REQUEST_CONFIRM_CODE_FAILED:
      return {
        ...state,
        confirmCode: action.payload.confirmCode,
        data: action.payload.data,
        isFetching: false
      }
    case types.SET_CONFIRM_CODE: 
      return {
        ...state,
        confirmCode: action.payload.confirmCode
      }
    case types.SET_NAME: 
      return {
        ...state,
        name: action.payload.name
      }
    case types.SET_EMAIL: 
      return {
        ...state,
        email: action.payload.email
      }
    case types.SET_BIRTHDAY: 
      return {
        ...state,
        birthday: action.payload.birthday
      }
    case types.SIGNUP_REQUEST:
      return {
        ...state,
        isFetching: true
      }
    case types.SIGNUP_SUCCESS:
      return {
        ...state,
        isFetching: false,
        statusMessage: action.payload.statusMessage,
        statusMessageType: 'success'
      }
    case types.SIGNUP_FAILURE:
      return {
        ...state,
        isFetching: false,
        statusMessage: action.payload.statusMessage,
        statusMessageType: 'danger'
      }
    case types.CLEAR_MESSAGE:
      return {
        ...state,
        statusMessage: ''
      }
    case types.FACEBOOK_SIGNUP_REQUEST:
      return {
        ...state,
        isFetching: true,
        isFacebookSigup: true,
      }
    case types.FACEBOOK_SIGNUP_SUCCESS:
      return {
        ...state,
        ...action.payload,
        isFacebookSigup: true,
        isFetching: false,
        statusMessage: action.payload.statusMessage,
        statusMessageType: 'success'
      }
    case types.FACEBOOK_SIGNUP_FAILED:
      return {
        ...state,
        ...action.payload,
        isFetching: false,
        isFacebookSigup: true,
        statusMessage: action.payload.statusMessage,
        statusMessageType: 'danger'
      }
    case types.FACEBOOK_SIGNUP_CANCELED:
      return {
        ...state,
        isFetching: false,
        isFacebookSigup: true,
        statusMessage: '',
        statusMessageType: ''
      }
    default: 
      return state
  }
}
