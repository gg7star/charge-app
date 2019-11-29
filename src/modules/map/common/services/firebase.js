import { Firebase, FirebaseRef } from '~/common/lib/firebase';

export function getPlances() {
  return FirebaseRef.child(`places`).once('value').then((snapshot) => {
    console.log('===== getPlances: ', snapshot)
    if (snapshot.exists) {
      return snapshot.val()
    } else {
      throw new Error('account info does not exist')
    }
  })
}

export function searchPlances(searchKey) {
  return FirebaseRef.child(`places`).once('value').then((snapshot) => {
    console.log('===== searchPlances: ', snapshot)
    if (snapshot.exists) {
      return snapshot.val()
    } else {
      throw new Error('account info does not exist')
    }
  })
}