import Firebase from 'firebase'
var config = {
  apiKey: 'AIzaSyCuHiELlCjxtyZ5UGq_xdiKsF83enxe968',
  authDomain: 'launch-box-1.firebaseapp.com',
  databaseURL: 'https://launch-box-1.firebaseio.com',
  projectId: 'launch-box-1',
  storageBucket: 'launch-box-1.appspot.com',
  messagingSenderId: '1045503569156',
  appId: '1:1045503569156:web:3a2cf40a49cf9b37267451'
}
let app = Firebase.initializeApp(config)
export const db = app.database()
export const firestorage = app.storage()
