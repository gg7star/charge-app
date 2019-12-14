import firebase from '@react-native-firebase/app';
import '@react-native-firebase/database';
import messaging from '@react-native-firebase/messaging';
import { requestNotifications } from "react-native-permissions";

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export async function createFcmToken() {
  console.log('====== check permission')
  const hasPermissions = await messaging().hasPermission()
  let token = null;
  if (hasPermissions) {
    console.log('====== hasPermission')
    await messaging().registerForRemoteNotifications()
    token = await messaging().getToken()
  } else {
    console.log('====== does not hasPermission')
    const permission = await requestNotifications(["alert", "badge", "sound"]);
    await sleep(5000);
    if (permission.status === 'granted') {
      await messaging().registerForRemoteNotifications();
      token = await messaging().getToken();
    }
  }
  console.log('==== fcmToken: ', token);
  return token;
}

export function startReceiveFcm(callback) {
  const messageListener = messaging().onMessage(async (remoteMessage) => {
    console.log('==== FCM Message:', remoteMessage);
    callback && callback(remoteMessage.data);
  });
  return messageListener;
}

export async function saveFcmToken(uid, fcmToken) {
  const usersRef = firebase.database().ref(`users/${uid}`);
  console.log('===== saveFcmToken: uid: ', uid, usersRef);
  const user = await usersRef.once('value');
  if (user) {
    const res = await usersRef.update({
      isOnline: true,
      pushToken: fcmToken,
      actived: true
    });
    return true;
  }
  return false;
}