import firebase from '@react-native-firebase/app';
import '@react-native-firebase/database';
import messaging from '@react-native-firebase/messaging';
import { requestNotifications } from "react-native-permissions";
// import type { Notification } from 'react-native-firebase';
// import * as admin from "firebase-admin";
import { processRequest } from '~/common/services/api';
import fcmConfig from '~/common/config/fcm';

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
    const permission = await requestNotifications(["badge", "sound"]); // removed "alert" permission
    await sleep(5000);
    if (permission.status === 'granted') {
      await messaging().registerForRemoteNotifications();
      token = await messaging().getToken();
    }
  }
  console.log('==== fcmToken: ', token, messaging());
  return token;
}

export function startReceiveFcm(callback) {
  // Web application
  const messageListener = messaging().onMessage(async (remoteMessage) => {
    console.log('==== FCM Message:', remoteMessage);
    callback && callback(remoteMessage.data);
  });
  return messageListener;
  
  // Mobile application
  // const messageListener = firebase.notifications().onNotification((notification) => {
  //   console.log('==== FCM Message:', remoteMessage);
  //   alert('Notification received!', notification);
  //   callback && callback(notification);
  // });
  
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

export async function sendFcmMessage(pushToken, payload) {
  // try {
  //   const res = await admin.messaging().sendToDevice(
  //     pushToken, payload
  //   );
  //   console.log('===== sendFcmMessage: res: ', res);
  // } catch (error) {
  //   console.log('==== sendFcmMessage: error: ', error)
  // }

  // POST https://fcm.googleapis.com/v1/projects/myproject-b5ae1/messages:send HTTP/1.1
  var message = {
    data: payload,
    token: pushToken
  };
  const res  = await processRequest(
    'https://fcm.googleapis.com/v1/projects/nono-app-a7dde/messages:send',
    'POST',
    message,
    {Authorization: `Bearer ${pushToken}`}
  )
  console.log('==== res: ', res);

// Content-Type: application/json
// Authorization: Bearer ya29.ElqKBGN2Ri_Uz...HnS_uNreA

// {
//    "message":{
//       "token":"bk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1...",
//       "notification":{
//         "body":"This is an FCM notification message!",
//         "title":"FCM Message"
//       }
//    }
// }

}