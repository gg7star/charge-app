export function getEmail(phoneNumber) {
  return `nono-${phoneNumber}@account.nono.com`
}

export function getEmailForFacebook(fbId) {
  return `nono-fb-${fbId}@account.nono.com`
}

export function getPassword(phoneNumber) {
  return 'Password123!'
}

function generateRandomDigitNumber() {
  return Math.floor(1000+Math.random()*9000);
}

export function getConfirmCode(phoneNumber) {
  const confirmCode = generateRandomDigitNumber();
  return confirmCode
}
