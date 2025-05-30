// Web-specific push notification handling
import { onMessageListener } from '../firebaseConfig';

export const initWebPushNotification = async () => {
  try {
    // Request permission using the browser's native API
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return false;
    }

    // Set up message listener for web
    onMessageListener()
      .then(payload => {
        console.log('Received web message:', payload);
        // Show notification using the browser's native API
        new Notification(payload.notification.title, {
          body: payload.notification.body,
          icon: '/icon.png'
        });
      })
      .catch(err => console.log('Failed to receive web message:', err));

    return true;
  } catch (error) {
    console.error('Web push notification initialization error:', error);
    return false;
  }
};

export const checkWebNotificationStatus = async () => {
  return Notification.permission === 'granted';
};
