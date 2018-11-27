import Firebase from 'firebase'
var config = {
  apiKey: 'AIzaSyABwLpcWJbS0aBQQkNWQotkcCZGUAFtncs',
  authDomain: 'fake-priceless-project.firebaseapp.com',
  databaseURL: 'https://fake-priceless-project.firebaseio.com',
  projectId: 'fake-priceless-project',
  storageBucket: 'fake-priceless-project.appspot.com',
  messagingSenderId: '315774615792'
}
let app = Firebase.initializeApp(config)
export const db = app.database()
