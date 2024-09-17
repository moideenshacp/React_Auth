// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mernauth-13d10.firebaseapp.com",
  projectId: "mernauth-13d10",
  storageBucket: "mernauth-13d10.appspot.com",
  messagingSenderId: "577378621901",
  appId: "1:577378621901:web:7c0a6b90197db547ba4c84"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);