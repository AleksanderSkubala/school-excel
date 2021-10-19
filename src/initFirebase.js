import { initializeApp } from "firebase/app";
import { initializeAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBxV9RuDJXXLqHl90DBvAOKT2sTyDpF7ug",
  authDomain: "school-excel.firebaseapp.com",
  projectId: "school-excel",
  storageBucket: "school-excel.appspot.com",
  messagingSenderId: "164371852879",
  appId: "1:164371852879:web:8f7d2e8a4df2830fc9843a",
  measurementId: "G-08NN7BXM3M"
};

const app = initializeApp(firebaseConfig);
initializeAnalytics(app);

export const db = getFirestore(app);