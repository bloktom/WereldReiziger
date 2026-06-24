import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Firebase config wordt uit environment variables gehaald (zie .env.example).
// Vite stelt alleen variabelen beschikbaar die met VITE_ beginnen.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Is Firebase voldoende geconfigureerd? Zo niet, dan valt de app terug op
// DEMO-modus (lokale mock data via localStorage).
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)

// Handig voor diagnostiek in de UI: met welk project praat de app?
export const firebaseProjectId = firebaseConfig.projectId || '(geen)'

let app = null
let db = null

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig)
    db = getFirestore(app)
  } catch (e) {
    // Niet fataal: we vallen terug op demo-modus.
    console.error('Firebase-initialisatie mislukt, de app draait in demo-modus:', e)
  }
}

export { app, db }

