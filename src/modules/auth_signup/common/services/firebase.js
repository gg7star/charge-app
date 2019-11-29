import { Firebase, FirebaseRef } from '~/common/lib/firebase';

export function trySignup({ email, password, accountInfo }) {
  const { countryCode, phoneNumber, name, birthday } = accountInfo
  const userEmail = accountInfo.email
  return Firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((res) => {
    // Send user details to Firebase database
    if (res && res.user.uid) {
      const userId = `${countryCode}${phoneNumber}`
      var userData = {
        isFirst: true,
        actived: true,
        countryCode: countryCode,
        phoneNumber: phoneNumber,
        name,
        email: userEmail,
        birthday: birthday,
        isFacebookUser: false,
        userId,
        signedUp: Firebase.database.ServerValue.TIMESTAMP,
        lastLoggedIn: Firebase.database.ServerValue.TIMESTAMP,
      }
      FirebaseRef.child(`users/`).set(userData).then(() => {
        return
      })
    } else {
      throw new Error('account info save failed')
    }
  })
}


export function trySignupWithFacebook({ email, password, fbProfile }) {
  const { id, name, birthday } = fbProfile
  const userEmail = fbProfile.email
  return Firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((res) => {
    // Send user details to Firebase database
    if (res && res.user.uid) {
      const userId = `${id}`
      var userData = {
        isFirst: true,
        actived: true,
        countryCode: '',
        phoneNumber: '',
        name,
        email: userEmail,
        birthday: birthday || '',
        isFacebookUser: true,
        userId,
        signedUp: Firebase.database.ServerValue.TIMESTAMP,
        lastLoggedIn: Firebase.database.ServerValue.TIMESTAMP,
      }
      FirebaseRef.child(`users/${userId}`).set(userData).then(() => {
        return
      })
    } else {
      throw new Error('account info save failed')
    }
  })
}
