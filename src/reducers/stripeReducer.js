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
  cardInfo: false,
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
        payment: {...action.payload.data},
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
        cardInfo: {...action.payload.cardInfo},
        isFetching: true,
      };
    case stripeActionTypes.REGISTER_CARD_SUCCESS:
      return {
        ...state,
        // cardInfo: {...action.payload.cardInfo},
        customer: {...action.payload.customer},
        isFetched: true,
        isFetching: false
      };
    case stripeActionTypes.REGISTER_CARD_FAILURE:
      return {
        ...state,
        cardInfo: false,
        cardInfo: {...action.payload},
        isFetched: true,
        isFetching: false
      }
    case stripeActionTypes.LOAD_CARD_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case stripeActionTypes.LOAD_CARD_SUCCESS:
      return {
        ...state,
        cardInfo: {...action.payload.result.cardInfo},
        customer: { ...action.payload.result.customer },
        isFetched: true,
        isFetching: false,
      };
    case stripeActionTypes.LOAD_CARD_FAILURE:
      return {
        ...state,
        cardInfo: false,
        cardInfo: false,
        isFetched: true,
        isFetching: false,
      }
    default:
      return state;
  }
}
