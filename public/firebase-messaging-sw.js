// public/firebase-messaging-sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyDuKNBlDUJ3lPtUWsqV3k2vQqfyNOVt1Uk",
  authDomain: "vizis-bcec0.firebaseapp.com",
  projectId: "vizis-bcec0",
  storageBucket: "vizis-bcec0.firebasestorage.app",
  messagingSenderId: "27581590959",
  appId: "1:27581590959:web:92d6c6840d2c942c15d35a",
  measurementId: "G-LTHCZX4THN",
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
