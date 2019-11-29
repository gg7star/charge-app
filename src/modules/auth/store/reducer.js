import * as types from './actionTypes';

const initialState = {
  isAuthenticated: false,
  accountInfo: null,
  isFetching: false,
  statusMessage: '',
  isFirst: false
}

export default function reducer(state = initialState, action) {
  switch(action.type) {
    case types.LOGIN_REQUEST:
      return {
        ...state,
        isFetching: true
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
          statusMessage: ''
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
    case types.FACEBOOK_LOGIN_REQUEST:
        return {
          ...state,
          isFetching: true
        }
    default: 
      return state
  }
}
