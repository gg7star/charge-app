import firebase from '@react-native-firebase/app';
import '@react-native-firebase/database';
import firebaseConfig from '~/common/config/firebase';

const USER_TABLE_NAME = 'users';
const PLACES_TABLE_NAME = 'places';
const CARD_TABLE_NAME = 'cards';
const HISTORY_TABLE_NAME= 'histories';
const NOTIFICATION_TABLE_NAME = 'notifications';

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
  return firebase.database().ref(`/${PLACES_TABLE_NAME}`).once('value').then((snapshot) => {
    if (snapshot.exists) {
      return snapshot.val()
    } else {
      return []
    }
  });
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
            return user;
          }
        }
      }
      return null;
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

export async function saveCreditCard(cardInfo) {
  console.log('====== saveCreditCard: cardInfo: ', cardInfo)
  const uid = firebase.auth().currentUser.uid
  if (uid) {
    try {
      return firebase.database().ref(`${CARD_TABLE_NAME}/${uid}`)
        .set(cardInfo).then(() => {
          return cardInfo;
        });
    } catch (e) {
      console.log('==== error: ', e)
      return null
    }
  }
  return null;
}

export async function saveHistory(history) {
  console.log('====== saveHistory: history: ', history)
  const uid = firebase.auth().currentUser.uid
  if (uid) {
    try {
      return firebase.database().ref(`${HISTORY_TABLE_NAME}/${uid}`)
        .set(history).then(() => {
          return history;
        });
    } catch (e) {
      console.log('==== error: ', e)
      return null
    }
  }
  return null;
}

export async function loadHistories() {
  const uid = firebase.auth().currentUser.uid
  if (uid) {
    try {
      return firebase.database().ref(`/${HISTORY_TABLE_NAME}/${uid}`).once('value').then((snapshot) => {
        if (snapshot.exists) {
          return snapshot.val();
        } else {
          return [];
        }
      });
    } catch (e) {
      console.log('==== error: ', e);
      return null;
    }
  }
  return null;
}