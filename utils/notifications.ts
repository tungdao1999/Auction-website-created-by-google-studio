import { Product } from '../types';

/**
 * Requests permission from the user to send desktop notifications.
 */
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.warn("This browser does not support desktop notifications.");
    return;
  }
  // Let's check whether notification permissions have already been granted
  if (Notification.permission !== 'denied') {
    // We need to ask the user for permission
    await Notification.requestPermission();
  }
};

/**
 * Sends a browser notification if permission has been granted.
 * @param title The title of the notification.
 * @param options The notification options (e.g., body text, icon).
 */
export const sendNotification = (title: string, options: NotificationOptions) => {
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, options);
  }
};
