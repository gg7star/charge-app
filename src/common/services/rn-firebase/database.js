import firebase from '@react-native-firebase/app';
import '@react-native-firebase/database';
import firebaseConfig from '~/common/config/firebase';

const USER_TABLE_NAME = 'users';
const PLACES_TABLE_NAME = 'places';

export async function onlineDatabase() {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig.ios);
  }
  firebase.database().setPersistenceEnabled(false);
  await firebase.database().goOnline();
}

export async function createAccount(credential) {
  const user = credential.user._user;
  const { uid } = user;
  if (uid) {
    var userData = {
      uid,
      actived: true,
      signedUp: firebase.database.ServerValue.TIMESTAMP,
      lastLoggedIn: firebase.database.ServerValue.TIMESTAMP,
      isSocialUser: false,
      birthday: null,
      ...user,
    };

    try {
      return firebase.database().ref(`${USER_TABLE_NAME}/${uid}`)
        .set(userData).then(() => {
          return userData;
        });
    } catch (e) {
      console.log('==== error: ', e)
      return null
    }
  }
  return null;
}

export async function createSocialAccount(credential) {
  const user = credential.user._user;
  const { uid } = user;
  if (uid) {
    var userData = {
      uid,
      actived: true,
      signedUp: firebase.database.ServerValue.TIMESTAMP,
      lastLoggedIn: firebase.database.ServerValue.TIMESTAMP,
      isSocialUser: true,
      birthday: user.providerData[0].birthday || '',
      ...user
    };
    try {
      return firebase.database()
        .ref(`${USER_TABLE_NAME}/${uid}`)
        .set(userData).then(() => {
          return userData;
        });
    } catch (e) {
      console.log('==== createSocialAccount: error: ', e);
      return null;
    }
  }
  return null;
}


export async function setUserInfo({credential, userInfo}) {
  const user = credential.user._user ? credential.user._user : credential.user;
  const { uid } = user;
  if (uid) {
    var userData = {
      uid,
      actived: true,
      signedUp: firebase.database.ServerValue.TIMESTAMP,
      lastLoggedIn: firebase.database.ServerValue.TIMESTAMP,
      isSocialUser: false,
      birthday: null,
      ...user,
      ...userInfo
    };
    
    try {
      return firebase.database().ref(`${USER_TABLE_NAME}/${uid}`)
        .set(userData).then(() => {
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
  return firebase.database()
    .ref(`users/${uid}`)
    .once('value')
    .then((snapshot) => {
      if (snapshot.exists) return snapshot.val();
      else return null;
    }
  );
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

export async function checkIfUserExistsByPhoneNumber(phoneNumber) {
  return firebase.database().ref()
    .child(`users`)
    .once('value')
    .then((snapshot) => {
      if (snapshot.exists) {
        const users = snapshot.val();
        const uuids = Object.keys(users);
        for (var i = 0; i < uuids.length; i++) {
          const user = users[uuids[i]];
          if (user.phoneNumber === phoneNumber){
            return true;
          }
        }
      }
      return false;
    });
}


export async function searchPlances(searchKey) {
  return firebase.database().ref().child(`places`).once('value').then((snapshot) => {
    if (snapshot.exists) {
      return snapshot.val();
    } else {
      console.log('===== places info does not exist');
      return null;
    }
  });
}