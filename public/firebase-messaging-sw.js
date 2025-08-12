// public/firebase-messaging-sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyCI34gVPB1yf9FIchsSNtI3KrukB3l03M0",
  authDomain: "vizis-90eda.firebaseapp.com",
  projectId: "vizis-90eda",
  storageBucket: "vizis-90eda.firebasestorage.app",
  messagingSenderId: "278745922112",
  appId: "1:278745922112:web:2a7a12d2dd71639e083da5",
  measurementId: "G-6CX9H1Z5M8",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message:",
    payload
  );

  const notificationTitle =
    payload.notification?.title || payload.data?.title || "New Message";
  const notificationOptions = {
    body:
      payload.notification?.body ||
      payload.data?.body ||
      "You have a new message",
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    tag: payload.data?.tag || "general",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data?.url || "/"));
});
