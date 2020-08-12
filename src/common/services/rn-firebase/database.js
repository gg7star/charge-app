import firebase from '@react-native-firebase/app';
import '@react-native-firebase/database';
import moment from 'moment';
import firebaseConfig from '~/common/config/firebase';

const USER_TABLE_NAME = 'users';
const PLACES_TABLE_NAME = 'places';
const CARD_TABLE_NAME = 'cards';
const HISTORY_TABLE_NAME= 'histories';
const NOTIFICATION_TABLE_NAME = 'notifications';
const ADMOB_TABLE_NAME = 'admobs';
const RATE_TABLE_NAME = 'rates';

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

export async function saveCreditCard(cardInfo, customer) {
  console.log('====== saveCreditCard: cardInfo: ', cardInfo, customer)
  const uid = firebase.auth().currentUser.uid
  const cardData = {
    cardInfo: cardInfo,
    customer: customer
  };
  if (uid) {
    try {
      return firebase.database().ref(`${CARD_TABLE_NAME}/${uid}`)
        .set(cardData).then(() => {
          return cardInfo;
        });
    } catch (e) {
      console.log('==== error: ', e)
      return null
    }
  }
  return null;
}

export async function loadCreditCard() {
  const uid = firebase.auth().currentUser.uid;
  console.log('====== loadCreditCard: uid: ', uid);
  if (uid) {
    try {
      return firebase.database().ref(`${CARD_TABLE_NAME}/${uid}`).once('value').then((snapshot) => {
        console.log('===== snapshot: ', snapshot)
        if (snapshot.exists) {
          return snapshot.val();
        } else {
          return null;
        }
      });
    } catch (error) {
      console.log('===== error: ', error);
      return null;
    }
  }
  return null;
}

export async function saveHistory(history) {
  console.log('====== saveHistory: history: ', history)
  const uid = firebase.auth().currentUser.uid
  if (uid) {
    try {
      const dateKey = moment(history.startTime, 'DD/MM/YY LTS').format('DD-MM-YYYY LTS');
      return firebase.database().ref(`${HISTORY_TABLE_NAME}/${uid}/${dateKey}`)
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
          const dbHistories = snapshot.val();
          var histories = [];
          Object.keys(dbHistories).map((key) => {
            histories.push(dbHistories[key]);
          });
          const sortedHistories = oerferByStarTime(histories);
          return sortedHistories;
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

export async function saveNotification(notification) {
  console.log('====== saveNotification: notification: ', notification)
  const uid = firebase.auth().currentUser.uid
  if (uid) {
    try {
      const dateKey = moment(notification.date, 'DD/MM/YY LTS').format('DD-MM-YYYY LTS');
      return firebase.database().ref(`${NOTIFICATION_TABLE_NAME}/${uid}/${dateKey}`)
        .set(notification).then(() => {
          return notification;
        });
    } catch (e) {
      console.log('==== error: ', e);
      return null
    }
  }
  return null;
}

export async function loadNotifications() {
  const uid = firebase.auth().currentUser.uid
  if (uid) {
    try {
      return firebase.database().ref(`/${NOTIFICATION_TABLE_NAME}/${uid}`).once('value').then((snapshot) => {
        if (snapshot.exists) {
          const dbNotifications = snapshot.val();
          var notifications = [];
          Object.keys(dbNotifications).map((key) => {
            notifications.push(dbNotifications[key]);
          });
          const sortedNotifications = orderByDate(notifications);
          return sortedNotifications;
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

export async function loadAdmobs() {
  try {
    return firebase.database().ref(`/${ADMOB_TABLE_NAME}`).once('value').then((snapshot) => {
      if (snapshot.exists) {
        return snapshot.val()
      } else {
        return null;
      }
    });
  } catch (error) {
    console.log('===== error: ', error);
    return null;
  }
}

export async function saveRate(rate) {
  console.log('====== saveRate: rate: ', rate)
  const uid = firebase.auth().currentUser.uid
  if (uid) {
    try {
      const dateKey = moment(rate.date, 'DD/MM/YY LTS').format('DD-MM-YYYY LTS');
      return firebase.database().ref(`${RATE_TABLE_NAME}/${uid}/${dateKey}`)
        .set(rate).then(() => {
          return rate;
        });
    } catch (e) {
      console.log('==== error: ', e);
      return null
    }
  }
  return null;
}

function orderByDate(array) {
  const sortedArray = array.sort((a, b) => {
    const dateA = moment(a.date, 'DD/MM/YY LTS').format('YYYY-MM-DD LTS');
    const dateB = moment(b.date, 'DD/MM/YY LTS').format('YYYY-MM-DD LTS');
    if (dateA < dateB) return 1;
    if (dateA > dateB) return -1;
    return 0;
  });
  return sortedArray;
}

function oerferByStarTime(array) {
  const sortedArray = array.sort((a, b) => {
    const dateA = moment(a.startTime, 'DD/MM/YY LTS').format('YYYY-MM-DD LTS');
    const dateB = moment(b.startTime, 'DD/MM/YY LTS').format('YYYY-MM-DD LTS');
    if (dateA < dateB) return 1;
    if (dateA > dateB) return -1;
    return 0;
  });
  return sortedArray;
}