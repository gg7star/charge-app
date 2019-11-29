import * as types from './actionTypes'

export const initialState = {
  isFirstOpen: true,
  language: 'fr',
  globalNotification: {
    message: null,
    type: 'success',
    duration: 4000
  }
};

export default function AppStateReducer(
  state = initialState,
  action,
) {
  switch (action.type) {
    case types.SET_FIRST_OPEN:
      return {
        ...state,
        isFirstOpen: false,
      };
    case types.SET_LANGUAGE:
      return {
        ...state,
        language: action.language ? action.language : state.language
      };
    case types.SET_GLOBAL_NOTIFICATION:
      return {
        ...state,
        globalNotification: {
          message: action.payload.message,
          type: action.payload.type,
          duration: action.payload.duration ? action.payload.duration : 4000
        }
      }
    default:
      return state;
  }
}