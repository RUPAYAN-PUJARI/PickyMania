import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBQh2HRIIhFSZTwmCg3kyRPlWzxBPxrPrw",
  authDomain: "pickymania-64047.firebaseapp.com",
  projectId: "pickymania-64047",
  storageBucket: "pickymania-64047.firebasestorage.app",
  messagingSenderId: "254805781886",
  appId: "1:254805781886:web:32d75b8d4a71890903d72f",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
