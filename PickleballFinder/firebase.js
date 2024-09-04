// Import the functions you need from the SDKs you need
import { initializeAuth, getReactNativePersistence, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOs2oRAM7sLQTv93b8aylyxuDKVA7AXso",
  authDomain: "fir-auth-alleycat.firebaseapp.com",
  projectId: "fir-auth-alleycat",
  storageBucket: "fir-auth-alleycat.appspot.com",
  messagingSenderId: "527380035389",
  appId: "1:527380035389:web:442ac2904734df162f7754"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { auth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword };