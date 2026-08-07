import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import firebaseConfigData from '../../firebase-applet-config.json';

let firebaseApp: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

try {
  if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfigData);
  } else {
    firebaseApp = getApp();
  }
  auth = getAuth(firebaseApp);
  db = getFirestore(firebaseApp, firebaseConfigData.firestoreDatabaseId || undefined);
  storage = getStorage(firebaseApp);
} catch (error) {
  console.warn('Firebase initialization warning:', error);
}

export { firebaseApp, auth, db, storage };
