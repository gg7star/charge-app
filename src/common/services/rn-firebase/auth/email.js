import firebase from '@react-native-firebase/app';

export const AUTH_PROVIDER = 'password';

export async function loginInWithEmailPassword({email, password}) {
  try {
    console.log('===== signInWithEmailAndPassword: ', email, password);
    const firebaseUserCredential = await firebase.auth()
      .signInWithEmailAndPassword(email, password);
    console.log('===== signInWithEmailAndPassword: credential: ', firebaseUserCredential);
    return { credential: firebaseUserCredential, error: null, errorType: null};
  } catch (e) {
    console.log('====== error: ', e);
    var errorMessage = 'Firebase auth failed.';
    var errorType = e.code;
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
        break;
    }
    return {credential: null, error: errorMessage, errorType };
  }
}

export async function resetPasswordWithEmail(email) {
  try {
    const result = await firebase.auth().sendPasswordResetEmail(email);
    console.log('==== resetPasswordWithEmail: result: ', result);
    return {token: result, error: null, errorMessage: null};
  } catch (error) {
    console.log('==== resetPasswordWithEmail: ', resetPasswordWithEmail);
    var errorMessage = 'Failed to reste password.';
    switch(error.code) {
      case 'auth/invalid-email':
        errorMessage = 'You inputed invalid email. Please input an email with correct format.';
        break;
      case 'auth/user-not-found':
        errorMessage = 'Can not find user.';
        break;

    }
    return {token: null, errorType: error.code, errorMessage};
  }
  
}