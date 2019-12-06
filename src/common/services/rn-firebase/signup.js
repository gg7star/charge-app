import auth from '@react-native-firebase/auth';

export async function attempSignup({email, password}) {
  try {
    const res = await auth().createUserWithEmailAndPassword(email, password);
    return { data: res, error: null}
  } catch (e) {
    var errorMessage = 'Failed user creation.';
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
      case 'auth/email-already-in-use':
        errorMessage = 'The email address is already in use by another account.';
        break;
      default:
        console.log('==== error: ', e);
        break;
    }

    // callback(null, errorMessage);
    return { data: null, error: errorMessage };
  }
}


// export function attempSignupWithFacebook({ email, password, fbProfile }) {
//   const { id, name, birthday } = fbProfile
//   const userEmail = fbProfile.email
//   return firebase.auth().createUserWithEmailAndPassword(email, password)
//     .then((res) => {
//       // Send user details to Firebase database
//       const uid = res.user.uid;
//       if (res && res.user.uid) {
//         const userId = `${id}`
//         var userData = {
//           isFirst: true,
//           actived: true,
//           countryCode: '',
//           phoneNumber: '',
//           name,
//           email: userEmail,
//           birthday: birthday || '',
//           isFacebookUser: true,
//           userId,
//           signedUp: Firebase.database.ServerValue.TIMESTAMP,
//           lastLoggedIn: Firebase.database.ServerValue.TIMESTAMP,
//         }
//         FirebaseRef.child(`users/${userId}`).set(userData).then(() => {
//           return
//         })
//       } else {
//         throw new Error('account info save failed')
//       }
//     })
// }
