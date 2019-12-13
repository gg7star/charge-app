import { Firebase, FirebaseRef } from '~/common/lib/firebase';

export function startListenNotification() {
  const messaging = Firebase.messaging();
  messaging.usePublicVapidKey("BJzNHbqBdUapK21JivigLQfkb1lQJEY59JII5CPjrVRWf-pBoDgvrePO9SX-nHuQ3WSenLIhvBOjWcaNEKzK-Zg");
  messaging.getToken().then((currentToken) => {
    if (currentToken) {
      console.log('===== web push token: ', currentToken);
      // sendTokenToServer(currentToken);
      // updateUIForPushEnabled(currentToken);

      messaging.setBackgroundMessageHandler(function(payload) {
        console.log('[firebase-messaging-sw.js] Received background message ', payload);
        // Customize notification here
        const notificationTitle = 'Background Message Title';
        const notificationOptions = {
          body: 'Background Message body.',
          icon: '/firebase-logo.png'
        };
      
        return self.registration.showNotification(notificationTitle,
          notificationOptions);
      });
    } else {
      // Show permission request.
      console.log('No Instance ID token available. Request permission to generate one.');
      // Show permission UI.
      // updateUIForPushPermissionRequired();
      // setTokenSentToServer(false);
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    // showToken('Error retrieving Instance ID token. ', err);
    // setTokenSentToServer(false);
  });

  
}