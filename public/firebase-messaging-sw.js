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

// Initialize Firebase app
firebase.initializeApp(firebaseConfig);

// Get messaging instance
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('📩 Received background message:', payload);

  const notificationTitle = payload?.notification?.title || '🔔 Notification';
  const notificationOptions = {
    body: payload?.notification?.body || 'You have a new message!',
    
    data: {
      url: payload?.notification?.click_action || '/', // Optional click action
      ...payload?.data
    }
  };

  // Show browser notification
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Optional: Handle click on notification
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  // Navigate to a URL when user clicks the notification
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (const client of windowClients) {
        if (client.url === event.notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});
