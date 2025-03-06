import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAerP5XOn9eHqxg3FS2CYfZv3Ox-qvkqAo",
  authDomain: "running-app-bcb74.firebaseapp.com",
  databaseURL: "https://running-app-bcb74-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "running-app-bcb74",
  storageBucket: "running-app-bcb74.firebasestorage.app",
  messagingSenderId: "930621957124",
  appId: "1:930621957124:web:71a52369f707964a21c151",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const realtimeDB = getDatabase(app); 

export default firebaseConfig;

export { auth, db, realtimeDB };