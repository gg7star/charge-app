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
      default:
        console.error(e);
        break;
    }
    // callback(null, errorMessage);
    return {authInfo: null, userInfo: null, error: errorMessage};
  }
}

// For example: '+1 530-322-5413'
export async function attemptSignInWithPhone(phoneNumber, callback) {
  try {
    const result = await firebase.auth().signInWithPhoneNumber(phoneNumber);
    console.log('===== result: ', result);
  } catch (error) {
    console.log('===== error: ', error);
  } finally {
    console.log('===== finally')
  }
}
