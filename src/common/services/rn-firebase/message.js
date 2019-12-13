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
  console.log('===== startReceiveNotifications: uid: ', uid, usersRef);
  usersRef.once('value').then((user) => {
      if (user) {
        // gets the device's push token
        usersRef.update({
          isOnline: true,
          pushToken: fcmToken,
          actived: true
        });
      }
  });
}




// const requestPermission = async (callback) => {
//   try {
//     const permission = await requestNotifications(["alert", "badge", "sound"]);
//     await sleep(5000);
//     if (permission.status === "granted") {
//       getFcmToken(callback);
//     }
//   } catch (e) {
//     console.log('==== requestPermission: error: ', e);
//   }
// };

// const getFcmToken = async (callback) => {
//   try {
//     await messaging().registerForRemoteNotifications();
//     const fcmToken = await messaging().getToken();
//     //await handleToken(fcmToken);
//     console.log('===== fcmToken: ', fcmToken);
//     messageListener = messaging().onMessage(async (remoteMessage) => {
//       console.log('==== FCM Message Data:', remoteMessage.data);
//     });
//     callback(messageListener);
//   } catch (e) {
//     console.log('======= getFcmToken: error: ', e);
//   }
// }
// export async function checkPermission(callback) {
//   try {
//     console.log('==== messaging: ', messaging());
//     const enabled = await messaging().hasPermission();
//     console.log('==== messaging().hasPermission(): enabled: ', enabled);
//     if (enabled) {
//       getFcmToken(callback);
//     } else {
//       requestPermission(callback);
//     }
//   } catch (e) {
//     console.log('==== checkPermission: error: ', e);
//   }
// };

// export function startReceiveFcm() {
//   messageListener = messaging().onMessage(async (remoteMessage) => {
//     console.log('==== FCM Message Data:', remoteMessage.data);
//   });
//   return messageListener;
//   // messageListener();
// }