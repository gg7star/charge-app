export default {
  RENT_EXPIRE_TIMEOUT: 900000
};

export const RENT_STATUS = {
  INIT:         0,
  RENT_REQUEST: 1,
  RENTED:       2,
  RENT_FAILED:  3,
  RETURNED:     4,
  REQUIRED_FEEDBACK: 5,
  DONE:         6
}