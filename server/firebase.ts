import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

let firebaseApp: admin.app.App;
let firestoreDb: admin.firestore.Firestore;
let initializationFailed = false;

export function initializeFirebase() {
  if (firebaseApp) {
    return { app: firebaseApp, db: firestoreDb };
  }

  if (initializationFailed) {
    throw new Error('Firebase initialization previously failed');
  }

  try {
    const serviceAccountPath = join(process.cwd(), 'serviceAccountKey.json');
    
    if (!existsSync(serviceAccountPath)) {
      console.warn('⚠️ serviceAccountKey.json not found - Firebase will not be available');
      console.warn('⚠️ Falling back to data.json for read operations');
      initializationFailed = true;
      throw new Error('serviceAccountKey.json not found');
    }

    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    firestoreDb = firebaseApp.firestore();
    
    console.log('✅ Firebase Admin initialized successfully');
    return { app: firebaseApp, db: firestoreDb };
  } catch (error) {
    console.error('❌ Error initializing Firebase:', error);
    initializationFailed = true;
    throw error;
  }
}

export function getFirestore(): admin.firestore.Firestore {
  if (!firestoreDb) {
    const { db } = initializeFirebase();
    return db;
  }
  return firestoreDb;
}
