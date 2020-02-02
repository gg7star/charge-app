import { loginActionTypes } from '~/actions/types';
import STORAGE from '~/common/constants/storage';

const initialState = {
  isAuthenticated: false,
  isFetching: false,
  statusMessage: null,
  credential: null,
  isSocial: false,
  authProvider: null,
  fcm: {
    token: null,
    fcmListener: null,
    lastMessage: null
  }
}

export default function reducer(state = initialState, action) {
  const { payload } = action;

  switch(action.type) {
    case loginActionTypes.LOGIN_INIT:
      return {
        ...initialState
      }
    case loginActionTypes.TRY_SOCIAL_LOGIN_REQUEST:
      return {
        ...state,
        isFetching: true,
        authProvider: payload.authProvider
      }
    case loginActionTypes.LOGIN_REQUEST:
      return {
        ...state,
        isFetching: true,
        isSocial: false,
        authProvider: payload.authProvider
      }
    case loginActionTypes.LOGIN_SUCCESS:
    case loginActionTypes.SOCIAL_LOGIN_SUCCESS:
      var providerData = (
          payload.credential && 
          payload.credential.user
        ) && payload.credential.user.providerData;
      return {
        ...state,
        isAuthenticated: true,
        isFetching: false,
        credential: payload.credential,
        authProvider: ( providerData && providerData[0] )
          ? providerData[0].providerId
          : 'password'
      };
    case loginActionTypes.LOGIN_FAILURE:
      return {
        ...state,
        isFetching: false,
        statusMessage: payload.statusMessage
      }
    case loginActionTypes.LOGIN_CANCELED:
        return {
          ...state,
          isFetching: false,
          statusMessage: null,
          isSocial: false
        }
    case loginActionTypes.LOGOUT_DONE:
      const logout_state = {
        ...state,
        isAuthenticated: false,
        credential: null,
        fbProfile: null,
        isSocial: false,
        fbId: null
      }
      return logout_state;
    case loginActionTypes.CLEAR_MESSAGE:
      return {
        ...state,
        statusMessage: null
      }
    case loginActionTypes.SET_FCM_TOKEN:
      return {
        ...state,
        fcm: {token: payload.fcmToken}
      }
    case loginActionTypes.SET_FCM_LISTENER:
      return {
        ...state,
        fcm: {
          token: state.fcm.token,
          fcmListener: payload.fcmListener,
          lastMessage: state.fcm.lastMessage,
        }
      }
    case loginActionTypes.RECEIVED_FCM:
      return {
        ...state,
        fcm: {
          token: state.fcm.token,
          fcmListener: state.fcm.fcmListener,
          lastMessage: payload.messsage
        }
      }
    case loginActionTypes.LOGIN_LOAD_PREV_STATE:
      return {
        ...payload.prevState
      }
    default: 
      return state
  }
}
