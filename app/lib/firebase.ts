import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  type Messaging,
} from "firebase/messaging";
// import { saveFcmToken } from "~/services/save-fcm-token";
import { STORAGE_KEYS } from "~/utils/constants";

const firebaseConfig = {
  apiKey: "AIzaSyCI34gVPB1yf9FIchsSNtI3KrukB3l03M0",
  authDomain: "vizis-90eda.firebaseapp.com",
  projectId: "vizis-90eda",
  storageBucket: "vizis-90eda.firebasestorage.app",
  messagingSenderId: "278745922112",
  appId: "1:278745922112:web:2a7a12d2dd71639e083da5",
  measurementId: "G-6CX9H1Z5M8",
};

async function requestPermission() {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    console.log("Notification permission denied");
    return null;
  }
}

async function getFirebaseToken(messaging: Messaging) {
  return getToken(messaging, {
    vapidKey:
      "BDdQAP6cPUpoZJPAhwcSOuUnPM_-OoTJjh7tAAeHxfUHbhvOX-FN7YgyAb_biTFI_z0u46PfjrZ6hPGQNnR5NiE",
  });
}

function saveToken(token: string) {
  localStorage.setItem(STORAGE_KEYS.FCM_TOKEN, token);
  /*
    const storedToken = localStorage.getItem(STORAGE_KEYS.FCM_TOKEN);

    if (!storedToken) {
      const { error } = await saveFcmToken(token);
      if (!error) {
        localStorage.setItem(STORAGE_KEYS.FCM_TOKEN, token);
      }
    }

    // Only send the token to the server if it's new or has changed
    if (token !== storedToken) {
      const { error } = await saveFcmToken(token);
      if (!error) {
        localStorage.setItem(STORAGE_KEYS.FCM_TOKEN, token);
      }
    }*/
}

export const setupFirebaseMessaging = async () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    // Register the service worker first
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );
      console.log("Service Worker registered:", registration);

      // Wait for it to be ready
      await navigator.serviceWorker.ready;
      console.log("Service Worker ready");
    }

    const app = initializeApp(firebaseConfig);
    const messaging = getMessaging(app);

    await requestPermission();

    // Get token
    const token = await getFirebaseToken(messaging);
    saveToken(token);

    onMessage(messaging, (payload) => {
      console.log("Foreground message:", payload);
      // Handle foreground messages here
    });

    return token;
  } catch (error) {
    console.error("Firebase setup error:", error);
    return null;
  }
};

export const Firebase = {
  setup: setupFirebaseMessaging,
  requestPermission,
  saveToken,
};
