import { admobActionTypes } from './types';

const types = admobActionTypes;

export function admobInit() {
  return {
    type: types.ADMOB_INIT
  }
}

export function setAdmobSettings(settings) {
  return {
    type: types.ADMOB_SETTINGS,
    payload: {settings,}
  }
}

export function showAdmob() {
  return {
    type: types.ADMOB_SHOW,
  }
}

export function hideAdmob() {
  return {
    type: types.ADMOB_HIDE,
  }
}
