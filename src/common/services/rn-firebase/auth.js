import firebase from '@react-native-firebase/app';

export async function attemptSignInWithEmail({email, password}) {
  try {
    const res = await firebase.auth().signInWithEmailAndPassword(email, password);
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

export async function attemptSignInWithPhone(phoneNumber) {
  var confirmation = null;
  var error = null;
  try {
    confirmation = await firebase.auth().signInWithPhoneNumber(phoneNumber);
    console.log('===== confirmation: ', confirmation);
  } catch (e) {
    console.log('===== error: ', e);
    error = 'Failed to signin with phone number.';
    switch (e.code) {
      case 'auth/invalid-phone-number':
          error = 'Please enter a valid phone number.';
        break;
      case 'auth/too-many-requests':
          error = 'We have blocked all requests from this device due to unusual activity. Try again later.';
        break;
      default:
        console.error(e);
        break;
    }
  } finally {
    console.log('===== finally')
  }
  return {confirmation, error};
}
