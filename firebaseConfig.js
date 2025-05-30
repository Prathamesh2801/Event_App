import { initializeApp, getApps, getApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTgFQMU6mT--hqrq16JQDPrR3Dc9tMuiE",
  authDomain: "eventapp-a504d.firebaseapp.com",
  projectId: "eventapp-a504d",
  storageBucket: "eventapp-a504d.firebasestorage.app",
  messagingSenderId: "923349513093",
  appId: "1:923349513093:web:243979e9cf2e0165204aec"
};

// Initialize Firebase
let app;
let messaging;

try {
  if (typeof window !== 'undefined') {
    try {
      app = getApp();
    } catch (e) {
      app = initializeApp(firebaseConfig);
    }
    messaging = getMessaging(app);
  }
} catch (error) {
  console.log('Firebase initialization error:', error);
}

export const initializeFirebase = async () => {
  if (typeof window === 'undefined') return null;
  
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker not supported');
    return null;
  }

  try {
    // Register service worker first
    console.log('Registering service worker...');
    const registration = await navigator.serviceWorker.register('./firebase-messaging-sw.js', {
      scope: '/'
    });
    console.log('Service Worker registered:', registration);

    // Check if messaging is available
    if (!messaging) {
      console.error('Messaging is not initialized');
      return null;
    }

    // Request notification permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission not granted');
      return null;
    }

    // Get FCM token
    const currentToken = await getToken(messaging, {
      vapidKey: 'BKpn0VKsrCq14m4lxjj7PRvOYVf_iSp1b8F3_xv_9TX8DnUMswhsalAtYfcYPFAPghlJBUfB6X7aRPxM4XjbcPQ',
      serviceWorkerRegistration: registration
    });
    
    if (currentToken) {
      console.log('FCM token:', currentToken);
      return currentToken;
    } else {
      console.log('No token received');
      return null;
    }
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve, reject) => {
    if (!messaging) {
      reject(new Error('Messaging not initialized'));
      return;
    }

    try {
      return onMessage(messaging, (payload) => {
        console.log('Message received in foreground:', payload);
        resolve(payload);
      });
    } catch (error) {
      reject(error);
    }
      });
 

export default app;
