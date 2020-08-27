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
  },
  oneSignalDevice: null
}

export default function reducer(state = initialState, action) {
  const { payload } = action;
  const types = loginActionTypes;
  switch(action.type) {
    case types.LOGIN_INIT:
      return {
        ...initialState
      }
    case types.TRY_SOCIAL_LOGIN_REQUEST:
      return {
        ...state,
        isFetching: true,
        authProvider: payload.authProvider
      }
    case types.LOGIN_REQUEST:
      return {
        ...state,
        isFetching: true,
        isSocial: false,
        authProvider: payload.authProvider
      }
    case types.LOGIN_SUCCESS:
    case types.SOCIAL_LOGIN_SUCCESS:
      var providerData = (
          payload.credential && 
          payload.credential.user
        ) && payload.credential.user.providerData;
      return {
        ...state,
        isAuthenticated: true,
        isFetching: false,
        // auth: payload.auth,
        credential: payload.credential,
        authProvider: ( providerData && providerData[0] )
          ? providerData[0].providerId
          : 'password'
      };
    case types.LOGIN_FAILURE:
      return {
        ...state,
        isFetching: false,
        statusMessage: payload.statusMessage
      }
    case types.LOGIN_CANCELED:
        return {
          ...state,
          isFetching: false,
          statusMessage: null,
          isSocial: false
        }
    case types.LOGOUT_DONE:
      const logout_state = {
        ...state,
        isAuthenticated: false,
        credential: null,
        fbProfile: null,
        isSocial: false,
        fbId: null
      }
      return logout_state;
    case types.CLEAR_MESSAGE:
      return {
        ...state,
        statusMessage: null
      }
    case types.SET_FCM_TOKEN:
      return {
        ...state,
        fcm: {token: payload.fcmToken}
      }
    case types.SET_FCM_LISTENER:
      return {
        ...state,
        fcm: {
          token: state.fcm.token,
          fcmListener: payload.fcmListener,
          lastMessage: state.fcm.lastMessage,
        }
      }
    case types.RECEIVED_FCM:
      return {
        ...state,
        fcm: {
          token: state.fcm.token,
          fcmListener: state.fcm.fcmListener,
          lastMessage: payload.messsage
        }
      }
    case types.SET_ONE_SIGNAL_DEVICE:
      return {
        ...state,
        oneSignalDevice: payload.oneSignalDevice
      }
    case types.LOGIN_LOAD_PREV_STATE:
      return {
        ...payload.prevState
      }
    case types.UPDATED_USER_INFO:
      return {
        ...state,
        credential: {
          ...state.credential,
          user: {
            ...state.credential.user,
            ...payload.userInfo
          }
        }
      }
    default: 
      return state
  }
}
