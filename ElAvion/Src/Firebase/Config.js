import app from "firebase/app";
import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyBR4ANGNWXa7ZBf1ULIZdmvfU9M8GHIFrw",
  authDomain: "prog3v2-8a323.firebaseapp.com",
  projectId: "prog3v2-8a323",
  storageBucket: "prog3v2-8a323.appspot.com",
  messagingSenderId: "707444623095",
  appId: "1:707444623095:web:34f241efb989a4a9cdf5f2"
};

app.initializeApp(firebaseConfig)

export const auth = firebase.auth();
export const db = app.firestore();
export const storage = app.storage();