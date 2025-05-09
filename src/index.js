import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBRbywbvdAfc5wzlNoO-jI9VhPHFrVDsxg",
  authDomain: "errand-runner-42de7.firebaseapp.com",
  projectId: "errand-runner-42de7",
  storageBucket: "errand-runner-42de7.appspot.com",
  messagingSenderId: "166900683508",
  appId: "1:166900683508:web:87d5b2e455468877f344a1",
  measurementId: "G-TP1Q162TL1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app); // Initialize analytics

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
