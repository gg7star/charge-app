import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import { firebase } from '@react-native-firebase/auth';

export const AUTH_PROVIDER = 'google.com';

export async function loginWithGoogle() {
  try {
    // Add any configuration settings here:
    await GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      webClientId: '525053985309-ichlil0obomh5iekudjsaeupp0rffqco.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      // offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      // hostedDomain: '', // specifies a hosted domain restriction
      // loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
      // forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login.
      // accountName: '', // [Android] specifies an account name on the device that should be used
      iosClientId: '525053985309-gedjj8fvmkhe1g0tup6qn43gfhkvvc31.apps.googleusercontent.com', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    });

    await GoogleSignin.hasPlayServices();
    const authData = await GoogleSignin.signIn();
    // Create a new firebase credential with the token
    const credential = firebase.auth.GoogleAuthProvider
      .credential(authData.idToken, authData.accessToken)
    // Login with credential
    const firebaseUserCredential = await firebase.auth()
      .signInWithCredential(credential);

    return {
      credential: firebaseUserCredential,
      error: null,
      errorType: null
    };
  } catch (error) {
    var errorType = null;
    var errorMessage = null;
    console.log('====== googleLogin: ', error);
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      errorType = 'CANCEL';
      errorMessage = 'You cancelled the login flow.'
    } else if (error.code === statusCodes.IN_PROGRESS) {
      errorType = 'IN_PROGRESS';
      errorMessage = 'Operation (e.g. sign in) is in progress already';
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      errorType = 'PLAY_SERVICES_NOT_AVAILABLE';
      errorMessage = 'Your google play services was not available or outdated.';
    } else {
      errorType = 'SOMETHING';
      errorMessage = 'something';
    }
    return {
      credential: null,
      error: errorMessage,
      errorType
    };
  }
}