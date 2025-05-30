import { Platform } from 'react-native';
import { getMessaging } from 'firebase/messaging';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyCTgFQMU6mT--hqrq16JQDPrR3Dc9tMuiE",
  authDomain: "eventapp-a504d.firebaseapp.com",
  projectId: "eventapp-a504d",
  storageBucket: "eventapp-a504d.firebasestorage.app",
  messagingSenderId: "923349513093",
  appId: "1:923349513093:web:243979e9cf2e0165204aec"
};

// Initialize Firebase for web
let webApp;
let webMessaging;

if (Platform.OS === 'web' && typeof window !== 'undefined') {
  webApp = initializeApp(firebaseConfig);
  webMessaging = getMessaging(webApp);
}

// Initialize Firebase for native
let nativeMessaging;
if (Platform.OS !== 'web') {
  nativeMessaging = require('@react-native-firebase/messaging').default;
}

export const getMessagingInstance = () => {
  return Platform.OS === 'web' ? webMessaging : nativeMessaging;
};

export const initializeFirebaseMessaging = async () => {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log('Service Worker registered:', registration);
        
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.log('Permission not granted');
          return null;
        }
        
        return webMessaging;
      } catch (error) {
        console.error('Error initializing Firebase:', error);
        return null;
      }
    }
  } else {
    return nativeMessaging;
  }
};
