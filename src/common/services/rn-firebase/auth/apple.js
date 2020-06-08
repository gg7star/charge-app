import appleAuth, {
  AppleButton,
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
  AppleAuthCredentialState,
} from '@invertase/react-native-apple-authentication';
import { firebase } from '@react-native-firebase/auth';
import { Platform } from 'react-native';

export const AUTH_PROVIDER = 'apple.com';

export async function loginWithApple() {
  try {
      // 1). start a apple sign-in request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: AppleAuthRequestOperation.LOGIN,
        requestedScopes: [AppleAuthRequestScope.EMAIL, AppleAuthRequestScope.FULL_NAME],
      });

      // 2). if the request was successful, extract the token and nonce
      const { identityToken, nonce, isCancelled } = appleAuthRequestResponse;

      // can be null in some scenarios
      if (identityToken) {
        // 3). create a Firebase `AppleAuthProvider` credential
        const appleCredential = firebase.auth.AppleAuthProvider.credential(identityToken, nonce);

        // 4). use the created `AppleAuthProvider` credential to start a Firebase auth request,
        //     in this example `signInWithCredential` is used, but you could also call `linkWithCredential`
        //     to link the account to an existing user
        const userCredential = await firebase.auth().signInWithCredential(appleCredential);

        // user is now signed in, any Firebase `onAuthStateChanged` listeners you have will trigger
        console.log('==== Apple login success: userCredential: ', userCredential);
        console.warn(`==== Firebase authenticated via Apple, UID: ${userCredential.user.uid}`);
        return {credential: userCredential, error: null, errorType: null};
      } else {
        // handle this - retry?
        console.warn(`handle this - retry?`);
        if (isCancelled) {
          return {user: null, error: 'User cancelled request.', errorType: 'cancel'};
        }
        return {user: null, error: 'Failed to login with Apple account.', errorType: 'error'};
      }
  } catch (e) {
    console.log('==== Apple login: error: ', e);
    return {credential: null, error: e, errorType: 'error'};
  }
}
