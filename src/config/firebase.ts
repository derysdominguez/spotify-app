import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDwdRU0220eMUQX02PHpWh-XyPwmEd8_8o",
  authDomain: "spotify-app-ph.firebaseapp.com",
  projectId: "spotify-app-ph",
  storageBucket: "spotify-app-ph.appspot.com",
  messagingSenderId: "266812325509",
  appId: "1:266812325509:web:adf2798ed957a5a652f3ec",
  measurementId: "G-Q5HGVJ9C4Z"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export default app;

// const app = firebaseinitializeApp(firebaseConfig);
