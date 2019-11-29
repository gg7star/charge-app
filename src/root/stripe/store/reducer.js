import * as types from './actionTypes'

export const initialState = {
  amount: '0',
  tokenId: false,
  email: false,
  telnumber: false,
  stationSn: false,
  slotId: false,
  currency: 'eur',
  description: '',
  accessToken: false,
  isFetched: false,
  isFetching: false,
  error: false
};

export default function StripeStateReducer(
  state = initialState,
  action,
) {
  switch (action.type) {
    case types.DO_PAYMENT_INIT:
      return {
        ...initialState,
      };
    case types.DO_PAYMENT_REQUEST:
      return {
        ...state,
        ...action.payload,
        isFetching: true,
      };
    case types.DO_PAYMENT_SUCCESS:
      return {
        ...state,
        ...action.payload,
        isFetched: true,
        isFetching: false
      };
    case types.DO_PAYMENT_FAILURE:
      return {
        ...state,
        ...action.payload,
        isFetched: true,
        isFetching: false
      }
    default:
      return state;
  }
}
