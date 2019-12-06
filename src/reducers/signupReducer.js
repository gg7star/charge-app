import { signupActionTypes } from '~/actions/types';

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
    case signupActionTypes.SIGNUP_INIT:
      return {
        ...initialState,
        isFetching: false
      }
    case signupActionTypes.SET_PHONE_NUMBER: 
      return {
        ...state,
        countryCode: action.payload.countryCode,
        phoneNumber: action.payload.phoneNumber,
        isFetching: true
      }
    case signupActionTypes.REQUEST_CONFIRM_CODE_SUCCESS:
      return {
        ...state,
        confirmCode: action.payload.confirmCode,
        data: action.payload.data,
        isFetching: false
      }
    case signupActionTypes.REQUEST_CONFIRM_CODE_FAILED:
      return {
        ...state,
        confirmCode: action.payload.confirmCode,
        data: action.payload.data,
        isFetching: false
      }
    case signupActionTypes.SET_CONFIRM_CODE: 
      return {
        ...state,
        confirmCode: action.payload.confirmCode
      }
    case signupActionTypes.SET_NAME: 
      return {
        ...state,
        name: action.payload.name
      }
    case signupActionTypes.SET_EMAIL: 
      return {
        ...state,
        email: action.payload.email
      }
    case signupActionTypes.SET_BIRTHDAY: 
      return {
        ...state,
        birthday: action.payload.birthday
      }
    case signupActionTypes.SIGNUP_REQUEST:
      return {
        ...state,
        isFetching: true
      }
    case signupActionTypes.SIGNUP_SUCCESS:
      return {
        ...state,
        isFetching: false,
        statusMessage: action.payload.statusMessage,
        statusMessageType: 'success'
      }
    case signupActionTypes.SIGNUP_FAILURE:
      return {
        ...state,
        isFetching: false,
        statusMessage: action.payload.statusMessage,
        statusMessageType: 'danger'
      }
    case signupActionTypes.CLEAR_MESSAGE:
      return {
        ...state,
        statusMessage: ''
      }
    case signupActionTypes.FACEBOOK_SIGNUP_REQUEST:
      return {
        ...state,
        isFetching: true,
        isFacebookSigup: true,
      }
    case signupActionTypes.FACEBOOK_SIGNUP_SUCCESS:
      return {
        ...state,
        ...action.payload,
        isFacebookSigup: true,
        isFetching: false,
        statusMessage: action.payload.statusMessage,
        statusMessageType: 'success'
      }
    case signupActionTypes.FACEBOOK_SIGNUP_FAILED:
      return {
        ...state,
        ...action.payload,
        isFetching: false,
        isFacebookSigup: true,
        statusMessage: action.payload.statusMessage,
        statusMessageType: 'danger'
      }
    case signupActionTypes.FACEBOOK_SIGNUP_CANCELED:
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
