import { Firebase, FirebaseRef } from '~/common/lib/firebase';

export function tryLogin({ userId, email, password }) {
  // console.log('===== try login with promise')
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
  console.log('===== try login with promise')
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
            console.log('===== logged in: ', snapshot.val())
            resolve(snapshot.val());
          } else {
            // throw new Error('account info does not exist')
            console.log('===== account info does not exist')
            reject(error);
          }
        })
      ))
  });
}
