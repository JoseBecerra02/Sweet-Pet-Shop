// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAOu2d20BqFbe2Ilm7lTlvn953tL6GM8GE",
  authDomain: "sweetpetshop-5477f.firebaseapp.com",
  projectId: "sweetpetshop-5477f",
  storageBucket: "sweetpetshop-5477f.appspot.com",
  messagingSenderId: "559380812966",
  appId: "1:559380812966:web:621c71ccedb15297451067",
  measurementId: "G-4ECC4H19CV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);