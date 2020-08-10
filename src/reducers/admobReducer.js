import { admobActionTypes } from '~/actions/types';

export const initialState = {
  settings: null,
  isShow: false,
  isFetched: false,
  isFetching: false,
  error: false
};

export default function AdmobStateReducer(
  state = initialState,
  action,
) {
  switch (action.type) {
    case admobActionTypes.ADMOB_SETTINGS_INIT:
      return {
        ...initialState,
      };
    case admobActionTypes.ADMOB_SETTINGS:
      return {
        ...state,
        settings: action.payload.settings,
        isFetched: true,
        isFetching: false
      };
    case admobActionTypes.ADMOB_SHOW:
      return {
        ...state,
        isShow: true,
      };
    case admobActionTypes.ADMOB_HIDE:
      return {
        ...state,
        isShow: false,
      };
    default:
      return state;
  }
}
