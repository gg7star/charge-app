import { loginActionTypes } from '~/actions/types';
import { Actions } from 'react-native-router-flux';

const initialState = {
  isAuthenticated: false,
  accountInfo: null,
  authInfo: null,
  isFetching: false,
  statusMessage: '',
  isFirst: false,
  isFacebook: false,
  fcm: {token: null}
}

export default function reducer(state = initialState, action) {
  switch(action.type) {
    case loginActionTypes.LOGIN_INIT:
      return {
        isAuthenticated: false,
        accountInfo: null,
        isFetching: false,
        statusMessage: '',
        isFirst: false,
        isFacebook: false
      }
    case loginActionTypes.LOGIN_REQUEST:
      return {
        ...state,
        isFetching: true,
        isFacebook: false
      }
    case loginActionTypes.LOGIN_DONE:
      return {
        ...state,
        isAuthenticated: true,
        isFetching: false,
        accountInfo: action.payload.accountInfo,
        authInfo: action.payload.authInfo
      }
    case loginActionTypes.LOGIN_FAILURE:
      return {
        ...state,
        isFetching: false,
        statusMessage: action.payload.statusMessage
      }
    case loginActionTypes.LOGIN_CANCELED:
        return {
          ...state,
          isFetching: false,
          statusMessage: '',
          isFacebook: false
        }
    case loginActionTypes.LOGOUT_DONE:
      return {
        ...state,
        isAuthenticated: false,
        accountInfo: null,
        authInfo: null
      }
    case loginActionTypes.CLEAR_MESSAGE:
      return {
        ...state,
        statusMessage: ''
      }
    case loginActionTypes.TRY_FACEBOOK_LOGIN_REQUEST:
      return {
        ...state,
        isFetching: true,
        isFacebook: true
      }
    case loginActionTypes.TRY_FACEBOOK_LOGIN_CANCELED:
      return {
        ...state,
        isFetching: false,
        isFacebook: false
      }
    case loginActionTypes.FACEBOOK_LOGIN_REQUEST:
      return {
        ...state,
        isFetching: true,
        isFacebook: true
      }
    case loginActionTypes.SET_FCM_TOKEN:
      return {
        ...state,
        fcm: {token: action.payload.fcmToken}
      }
    case loginActionTypes.RECEIVED_FCM:
      return {
        ...state,
        fcm: {
          ...state.fcm,
          lastMessage: action.payload.messsage
        }
      }
    default: 
      return state
  }
}
