import * as types from './actionTypes';

const initialState = {
  // personalInfo: {
  //   name: 'Theo Rouilly',
  //   phone: '32 30 22 144 3331',
  //   email: 'theorouilly@nono.fr',
  //   birthDate: '18/06/2000'
  // },
  cash: {
    money: 300,
    couponCodeActied: false,
    couponCode: null
  },
  histories: [],
  history: null,
  payments: [
    {
      cost: 5,
      title: 'No bonus',
      options: [
        {
          title: 'No bonus'
        }
      ]
    },
    {
      cost: 10,
      title: 'No bonus',
      options: [
        {
          title: 'No bonus'
        }
      ]
    },
    {
      cost: 15,
      title: 'Bonus of 1€',
      options: [],
      hasBonus: true,
      options: [
        {
          title: 'BONUS OF 1€'
        }
      ]
    },
    {
      cost: 20,
      title: 'BONUS OF 2€ OR PLANT A TREE',
      hasBonus: true,
      options: [
        {
          title: 'BONUS OF 2€'
        },
        {
          title: 'PLANT A TREE'
        }
      ]
    }
  ],
  payment: null,
  cardInfo: null
}

export default function reducer(state = initialState, action) {
  switch(action.type) {
    case types.ADD_COUPON_SUCCESS:
      return addCoupon(state, action.payload.couponCode)
    case types.LOAD_HISTORY_SUCCESS:
      return {
        ...state,
        histories: action.payload.histories
      }
    case types.SELECT_HISTORY:
      return {
        ...state,
        history: state.histories[action.payload.index]
      }
    case types.SELECT_PAY_PRICE:
      return {
        ...state,
        payment: action.payload.payment
      }
    case types.ADD_CREDIT_CARD:
      return {
        ...state,
        cardInfo: action.payload.cardInfo
      }
    default: 
      return state
  }
}

function addCoupon (state, couponCode) {
  let { cash } = state
  cash.couponCode = couponCode
  cash.couponCodeActived = true
  return {
    ...state,
    cash
  }
}

export function loadHistories(state, histories) {
  console.log("sereerrererere");
  console.log(histories);
  
}