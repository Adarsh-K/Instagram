import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyDqyffDUd-jBD6WugwmlZO3XNqgXXpcs_k",
  authDomain: "instagram-1c394.firebaseapp.com",
  projectId: "instagram-1c394",
  storageBucket: "instagram-1c394.appspot.com",
  messagingSenderId: "448662200984",
  appId: "1:448662200984:web:b359817b4805174d8f66ed"
};

const app = firebase.initializeApp(firebaseConfig);
const db = app.firestore();
const auth = app.auth();
const storage = app.storage();

export { db, auth, storage };