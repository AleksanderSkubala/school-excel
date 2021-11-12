import { initializeApp } from "firebase/app";
import { initializeAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';

/* const firebaseConfig = {
  apiKey: "AIzaSyBxV9RuDJXXLqHl90DBvAOKT2sTyDpF7ug",
  authDomain: "school-excel.firebaseapp.com",
  projectId: "school-excel",
  storageBucket: "school-excel.appspot.com",
  messagingSenderId: "164371852879",
  appId: "1:164371852879:web:8f7d2e8a4df2830fc9843a",
  measurementId: "G-08NN7BXM3M"
}; */

const firebaseConfig = {
  apiKey: "AIzaSyBe23vGrWbbtK6cWQflEewoDvTBtKWQEBM",
  authDomain: "test-project-116cf.firebaseapp.com",
  databaseURL: "https://test-project-116cf.firebaseio.com",
  projectId: "test-project-116cf",
  storageBucket: "test-project-116cf.appspot.com",
  messagingSenderId: "507446435196",
  appId: "1:507446435196:web:ccd56d1abf6f31a8e058f9",
  measurementId: "G-BVQFXBP732"
};

const app = initializeApp(firebaseConfig);
initializeAnalytics(app);

export const db = getFirestore(app);