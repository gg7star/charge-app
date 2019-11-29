import { Firebase, FirebaseRef } from '~/common/lib/firebase';

export function tryLogin({ userId, email, password }) {
  return Firebase.auth().setPersistence(Firebase.auth.Auth.Persistence.LOCAL)
  .then(() =>  
    Firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => 
      FirebaseRef.child(`users/${userId}`).once('value').then((snapshot) => {
        if (snapshot.exists) {
          FirebaseRef.child(`users/${userId}`).update({
            isFirst: false
          })
          return snapshot.val()
        } else {
          throw new Error('account info does not exist')
        }
      })
    )
  )
}
