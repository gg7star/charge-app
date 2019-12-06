import firebase from '@react-native-firebase/app';
import '@react-native-firebase/database';
// import auth from '@react-native-firebase/auth';
// import database from '@react-native-firebase/database';
import firebaseConfig from '~/common/config/firebase';

export async function onlineDatabase() {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig.ios);
  }
  firebase.database().setPersistenceEnabled(false);
  await firebase.database().goOnline();
}

export async function createAccount(accountInfo) {
  const { countryCode, phoneNumber, name, birthday } = accountInfo;
  const userEmail = accountInfo.email;
  // Get the users ID
  const uid = firebase.auth().currentUser.uid;
  if (uid) {
    var userData = {
      uid,
      isFirst: true,
      actived: true,
      countryCode: countryCode,
      phoneNumber: phoneNumber,
      name,
      email: userEmail,
      birthday: birthday,
      isFacebookUser: false,
      signedUp: firebase.database.ServerValue.TIMESTAMP,
      lastLoggedIn: firebase.database.ServerValue.TIMESTAMP
    };
    try {
      return firebase.database().ref(`users/${uid}`).set(userData).then(() => {
        return userData;
      });
    } catch (e) {
      console.log('==== error: ', e)
      return null
    }
  }
  return null;
}

export async function createFacebookAccount(fbProfile) {
  const { id, name, birthday, avatar } = fbProfile
  const userEmail = fbProfile.email
  // Get the users ID
  const uid = firebase.auth().currentUser.uid;
  if (uid) {
    var userData = {
      uid,
      isFirst: true,
      actived: true,
      countryCode: '',
      phoneNumber: '',
      name,
      email: userEmail,
      birthday: birthday || '',
      isFacebookUser: true,
      facbookId: fbProfile.id,
      avatar,
      signedUp: firebase.database.ServerValue.TIMESTAMP,
      lastLoggedIn: firebase.database.ServerValue.TIMESTAMP
    }
    try {
      return firebase.database().ref(`users/${uid}`).set(userData).then(() => {
        return userData;
      });
    } catch (e) {
      console.log('==== error: ', e)
      return null
    }
  }
  return null;
}

export function getUserInfo(uid) {
  return firebase.database().ref(`users/${uid}`).once('value').then((snapshot) => {
    if (snapshot.exists) {
      firebase.database().ref(`users/${uid}`).update({
        isFirst: false
      });
      return snapshot.val();
    } else {
      return null;
    }
  });
}


export function getCurrentUserInfo() {
  const uid = firebase.auth().currentUser.uid;
  return getUserInfo(uid)
}

export async function getPlances() {
  return firebase.database().ref(`/places`).once('value').then((snapshot) => {
    if (snapshot.exists) {
      return snapshot.val()
    } else {
      return []
    }
  })
}

export async function searchPlances(searchKey) {
  return firebase.database().ref().child(`places`).once('value').then((snapshot) => {
    console.log('===== searchPlances: ', snapshot)
    if (snapshot.exists) {
      return snapshot.val()
    } else {
      throw new Error('account info does not exist')
    }
  })
}