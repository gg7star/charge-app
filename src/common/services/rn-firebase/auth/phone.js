import firebase from '@react-native-firebase/app';

export async function attemptSignInWithEmail({email, password}) {
  try {
    const res = await firebase.auth().signInWithEmailAndPassword(email, password);
    console.log('===== res: ', res);
    return { authInfo: res, error: null };
  } catch (e) {
    var errorMessage = 'Firebase auth failed.';
    switch (e.code) {
      case 'auth/invalid-email':
        errorMessage = 'Please enter a valid email address.';
        break;
      case 'auth/user-disabled':
        errorMessage = 'This account has been disabled.';
        break;
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        errorMessage = 'No user found or wrong password.';
        break;
      case 'auth/internal-error':
        errorMessage = 'An internal error has occurred, please try again.'
        break;
      default:
        console.error(e);
        break;
    }
    // callback(null, errorMessage);
    return {authInfo: null, userInfo: null, error: errorMessage};
  }
}

export async function loginWithPhone(phoneNumber) {
  var confirmation = null;
  var errorMessage = null;
  var errorType = null;
  try {
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
      default:
        console.log('==== error: ', error);
        break;
    }
  }
  return {confirmation, error: errorMessage, errorType};
}

export async function confirmWithPhone(confirmation, confirmCode) {
  try {
    const credential = await confirmation.confirm(confirmCode)
    return { credential, error: null, errorType: null };
  } catch (error) {
    console.log('===== Phone number confirmation error: ', error);
    return { credential: null, error: error.message, errorType: error.code };
  }
}
