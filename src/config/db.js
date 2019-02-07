import Firebase from 'firebase'
var config = {
  apiKey: 'AIzaSyDqRadwpsnjIGOlpvYIzW2fUCnmpVtSXbE',
  authDomain: 'thrive-studies-2-8ddb5.firebaseapp.com',
  databaseURL: 'https://thrive-studies-2-8ddb5.firebaseio.com',
  projectId: 'thrive-studies-2-8ddb5',
  storageBucket: 'thrive-studies-2-8ddb5.appspot.com',
  messagingSenderId: '125775085187'
}
let app = Firebase.initializeApp(config)
export const db = app.database()
export const firestorage = app.storage()
