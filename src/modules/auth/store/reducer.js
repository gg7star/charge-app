import * as types from './actionTypes';

const initialState = {
  isAuthenticated: false,
  accountInfo: null,
  isFetching: false,
  statusMessage: '',
  isFirst: false,
  isFacebook: false
}

export default function reducer(state = initialState, action) {
  switch(action.type) {
    case types.LOGIN_REQUEST:
      return {
        ...state,
        isFetching: true,
        isFacebook: false
      }
    case types.LOGIN_DONE:
      return {
        ...state,
        isAuthenticated: true,
        isFetching: false,
        accountInfo: action.payload.accountInfo
      }
    case types.LOGIN_FAILURE:
      return {
        ...state,
        isFetching: false,
        statusMessage: action.payload.statusMessage
      }
    case types.LOGIN_CANCELED:
        return {
          ...state,
          isFetching: false,
          statusMessage: '',
          isFacebook: false
        }
    case types.LOGOUT_DONE:
      return {
        ...state,
        isAuthenticated: false,
        accountInfo: null
      }
    case types.CLEAR_MESSAGE:
      return {
        ...state,
        statusMessage: ''
      }
    case types.TRY_FACEBOOK_LOGIN_REQUEST:
      return {
        ...state,
        isFetching: true,
        isFacebook: true
      }
    case types.TRY_FACEBOOK_LOGIN_CANCELED:
      return {
        ...state,
        isFetching: false,
        isFacebook: false
      }
    case types.FACEBOOK_LOGIN_REQUEST:
      return {
        ...state,
        isFetching: true,
        isFacebook: true
      }
    default: 
      return state
  }
}
