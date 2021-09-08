import firebase from 'firebase'
require('@firebase/firestore')

const firebaseConfig = {
    apiKey: "AIzaSyC-IqUQrgdpFGZmdNoEWoxczvay2bK62d4",
    authDomain: "willy-app-55d81.firebaseapp.com",
    projectId: "willy-app-55d81",
    storageBucket: "willy-app-55d81.appspot.com",
    messagingSenderId: "80429130317",
    appId: "1:80429130317:web:35515499d8c16c2dd43204"
  };
  
  // Initialize Firebase
 firebase.initializeApp(firebaseConfig);
  export default firebase.firestore