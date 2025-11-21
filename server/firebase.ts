import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { join } from 'path';

let firebaseApp: admin.app.App;
let firestoreDb: admin.firestore.Firestore;

export function initializeFirebase() {
  if (firebaseApp) {
    return { app: firebaseApp, db: firestoreDb };
  }

  try {
    const serviceAccountPath = join(process.cwd(), 'serviceAccountKey.json');
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    firestoreDb = firebaseApp.firestore();
    
    console.log('✅ Firebase Admin initialized successfully');
    return { app: firebaseApp, db: firestoreDb };
  } catch (error) {
    console.error('❌ Error initializing Firebase:', error);
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
