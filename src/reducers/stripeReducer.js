import { stripeActionTypes } from '~/actions/types';

export const initialState = {
  payment: {
    amount: '0',
    tokenId: false,
    email: false,
    telnumber: false,
    stationSn: false,
    slotId: false,
    currency: 'eur',
    description: '',
  },
  customer: null,
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
    case stripeActionTypes.DO_PAYMENT_INIT:
      return {
        ...initialState,
      };
    case stripeActionTypes.DO_PAYMENT_REQUEST:
      return {
        ...state,
        payment: {...action.payload},
        isFetching: true,
      };
    case stripeActionTypes.DO_PAYMENT_SUCCESS:
      return {
        ...state,
        payment: {...action.payload},
        isFetched: true,
        isFetching: false
      };
    case stripeActionTypes.DO_PAYMENT_FAILURE:
      return {
        ...state,
        payment: {...action.payload},
        isFetched: true,
        isFetching: false
      }
    case stripeActionTypes.REGISTER_CARD_REQUEST:
      return {
        ...state,
        customer: {...action.payload},
        isFetching: true,
      };
    case stripeActionTypes.REGISTER_CARD_SUCCESS:
      return {
        ...state,
        customer: {...action.payload},
        isFetched: true,
        isFetching: false
      };
    case stripeActionTypes.REGISTER_CARD_FAILURE:
      return {
        ...state,
        customer: {...action.payload},
        isFetched: true,
        isFetching: false
      }
    default:
      return state;
  }
}
