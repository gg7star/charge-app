import auth from '@react-native-firebase/auth';
import {AccessToken, LoginManager} from 'react-native-fbsdk';

const PROVIDER_ID = 'facebook.com';

async function loginWithFacebook() {
  try {
    // if (variant === 'UNLINK') {
    //   await user.unlink(PROVIDER_ID);
    // } else {
    const {isCancelled} = await LoginManager.logInWithPermissions([
      'email', 'public_profile',
    ]);

    if (isCancelled) {
      console.log('==== Facebook Auth Canceled');
    } else {
      const result = await AccessToken.getCurrentAccessToken();
      if (!result) {
        throw new Error(
          'No Access Token was returned from Facebook SDK.',
        );
      }

      const {accessToken} = result;

      const credential = auth.FacebookAuthProvider.credential(
        accessToken,
      );

      // if (variant === 'LINK') {
      //   await user.linkWithCredential(credential);
      // } else if (variant === 'SIGN_IN') {
        const res = await auth().signInWithCredential(credential);
      // }
    }
  } catch (error) {
    console.log('==== Facebook Auth Error', error.message);
  } finally {
    console.log('===== finally');
  }
}
