// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { collection, getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
}
 
const app = initializeApp(firebaseConfig)
// Export firestore database
// It will be imported into your react app whenever it is needed
export const db = getFirestore(app)

export const endpointsCollection = collection(db, 'endpoints')
export const requestsCollection = collection(db, 'requests')