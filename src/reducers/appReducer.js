import { appActionTypes } from '~/actions/types';
import { LOAD, SAVE } from 'redux-storage';

export const initialState = {
  isFirstOpen: true,
  language: 'fr',
  globalNotification: {
    message: null,
    type: 'success',
    duration: 4000
  },
  loaded: false
};

export default function AppStateReducer(
  state = initialState,
  action,
) {
  switch (action.type) {
    case appActionTypes.SET_FIRST_OPEN:
      return {
        ...state,
        isFirstOpen: false,
      };
    case appActionTypes.SET_LANGUAGE:
      return {
        ...state,
        language: action.language ? action.language : state.language
      };
    case appActionTypes.SET_GLOBAL_NOTIFICATION:
      return {
        ...state,
        globalNotification: {
          message: action.payload.message,
          type: action.payload.type,
          duration: action.payload.duration ? action.payload.duration : 4000
        }
      }
    case LOAD:
      console.log('==== LOAD: ', state);
      return { ...state, loaded: true };
    default:
      return state;
  }
}
