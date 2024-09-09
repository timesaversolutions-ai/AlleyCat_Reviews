import { initializeAuth, getReactNativePersistence, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOs2oRAM7sLQTv93b8aylyxuDKVA7AXso",
  authDomain: "fir-auth-alleycat.firebaseapp.com",
  projectId: "fir-auth-alleycat",
  storageBucket: "fir-auth-alleycat.appspot.com",
  messagingSenderId: "527380035389",
  appId: "1:527380035389:web:442ac2904734df162f7754"
};

// Initialize Firebase app if not already initialized
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0]; // If already initialized, use the existing app
}

// Initialize Firebase Authentication and Firestore
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Initialize Firebase Storage
const storage = getStorage(app);

const db = getFirestore(app);

export { auth, db, storage, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword };