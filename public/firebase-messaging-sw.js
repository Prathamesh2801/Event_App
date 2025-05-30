importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTgFQMU6mT--hqrq16JQDPrR3Dc9tMuiE",
  authDomain: "eventapp-a504d.firebaseapp.com",
  projectId: "eventapp-a504d",
  storageBucket: "eventapp-a504d.firebasestorage.app",
  messagingSenderId: "923349513093",
  appId: "1:923349513093:web:243979e9cf2e0165204aec"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
