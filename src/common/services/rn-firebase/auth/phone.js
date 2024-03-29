import firebase from '@react-native-firebase/app';

export const AUTH_PROVIDER = 'phone';

export async function loginWithPhone(phoneNumber) {
  var confirmation = null;
  var errorMessage = null;
  var errorType = null;
  try {
    console.log('==== loginWithPhone phoneNumber: ', phoneNumber)
    confirmation = await firebase.auth().signInWithPhoneNumber(phoneNumber);
    console.log('===== confirmation: ', confirmation);
  } catch (error) {
    console.log('===== errorMessage: ', error);
    // errorMessage = error.message;
    // errorType = error.code;
    switch (error.code) {
      case 'auth/invalid-phone-number':
        errorMessage = 'Please enter a valid phone number.';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'A network error has occurred, please try again.';
      default:
        console.log('==== error: ', error);
        break;
    }
  }
  return {confirmation, error: errorMessage, errorType};
}

export async function confirmWithPhone(confirmation, confirmCode) {
  try {
    const user = await confirmation.confirm(confirmCode)
    console.log('===== confirmWithPhone: confirmation: ', confirmation);
    console.log('===== confirmWithPhone: confirmCode: ', confirmCode);
    console.log('===== confirmWithPhone: user: ', user);

    return { user, error: null, errorType: null };
  } catch (error) {
    console.log('===== Phone number confirmation error: ', error);
    return { user: null, error: error.message, errorType: error.code };
  }
}

export async function logoutWithPhone() {
  return await firebase.auth().signOut();
}