
import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
// Add other Firebase services as needed, e.g., getStorage

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const missingEnvVars = Object.entries(firebaseConfig)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingEnvVars.length > 0) {
  const detailedMissing = missingEnvVars.map(key => `❌ ${key.replace(/([A-Z])/g, ' $1').trim()}: Missing from process.env`);
  const summary = `Found: ${Object.keys(firebaseConfig).length - missingEnvVars.length} / ${Object.keys(firebaseConfig).length}\n  Missing: ${missingEnvVars.length} / ${Object.keys(firebaseConfig).length}`;

  const errorMessage = `
Firebase Initialization Error: Critical environment variables are missing or not accessible to the application.

Status of Checked Variables (process.env):
${Object.entries(firebaseConfig).map(([key, value]) => value ? `✅ ${key.replace(/([A-Z])/g, ' $1').trim()}: Found (Value: ${typeof value === 'string' && key.toLowerCase().includes('apikey') ? value.substring(0,4) + '...' : 'Exists'})` : `❌ ${key.toUpperCase()}: Missing`).join('\n')}

Summary:
  ${summary}

Please ensure all required NEXT_PUBLIC_FIREBASE_... variables are correctly set.
If using .env.local for local development, ensure it's at the project root and you've restarted the server.
For deployed environments (like Firebase Studio Publish), environment variables often need to be configured directly in the hosting platform's settings/dashboard, as .env.local might not be used.

Example .env.local content:
NEXT_PUBLIC_FIREBASE_API_KEY=your_value_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_value_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_value_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_value_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_value_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_value_here

After adding or updating environment variables, you MUST restart/redeploy your application for the changes to take effect.
  `;
  if (typeof window !== 'undefined') {
    // For client-side, make it more visible if possible
    const el = document.createElement('pre');
    el.textContent = errorMessage;
    el.style.whiteSpace = 'pre-wrap';
    el.style.padding = '20px';
    el.style.backgroundColor = 'lightyellow';
    el.style.border = '2px solid red';
    el.style.position = 'fixed';
    el.style.top = '10px';
    el.style.left = '10px';
    el.style.zIndex = '9999';
    document.body.prepend(el);
  }
  throw new Error(errorMessage);
}


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// If running in development and using Firebase Emulator
if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
  // Default emulator ports: Auth: 9099, Firestore: 8080, Storage: 9199
  // Ensure your firebase.json specifies these or update here.
  // connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
  // connectStorageEmulator(storage, 'localhost', 9199);
  // console.log("Firebase connected to EMULATORS");
}


export { app, auth, firebaseConfig };
