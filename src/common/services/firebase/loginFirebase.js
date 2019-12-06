import { Firebase, FirebaseRef } from '~/common/lib/firebase';

export function tryLogin({ userId, email, password }) {
  // console.log('===== try login with promise, ', userId, email, password)
  // return Firebase.auth().setPersistence(Firebase.auth.Auth.Persistence.LOCAL)
  // .then(() =>  
  //   Firebase.auth().signInWithEmailAndPassword(email, password)
  //   .then(() => 
  //     FirebaseRef.child(`users/${userId}`).once('value').then((snapshot) => {
  //       if (snapshot.exists) {
  //         FirebaseRef.child(`users/${userId}`).update({
  //           isFirst: false
  //         })
  //         console.log('===== logged in: ', snapshot.val())
  //         return snapshot.val()
  //       } else {
  //         throw new Error('account info does not exist')
  //       }
  //     })
  //   )
  // )
  return new Promise((resolve, reject) => {
    Firebase.auth().setPersistence(Firebase.auth.Auth.Persistence.LOCAL)
    .then(() =>  
      Firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => 
        FirebaseRef.child(`users/${userId}`).once('value').then((snapshot) => {
          if (snapshot.exists) {
            FirebaseRef.child(`users/${userId}`).update({
              isFirst: false
            })
            resolve(snapshot.val());
          } else {
            // throw new Error('account info does not exist')
            reject('account info does not exist');
          }
        })
      ))
  });
}
