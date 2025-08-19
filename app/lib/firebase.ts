import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
  type Messaging,
} from "firebase/messaging";
import { STORAGE_KEYS } from "~/utils/constants";
import { saveFcmToken } from "~/services/save-fcm-token";
import { useToastStore } from "~/stores/toast";

class FirebaseService {
  private static readonly VAPID_KEY =
    "BDdQAP6cPUpoZJPAhwcSOuUnPM_-OoTJjh7tAAeHxfUHbhvOX-FN7YgyAb_biTFI_z0u46PfjrZ6hPGQNnR5NiE";

  private static readonly firebaseConfig = {
    apiKey: "AIzaSyCI34gVPB1yf9FIchsSNtI3KrukB3l03M0",
    authDomain: "vizis-90eda.firebaseapp.com",
    projectId: "vizis-90eda",
    storageBucket: "vizis-90eda.firebasestorage.app",
    messagingSenderId: "278745922112",
    appId: "1:278745922112:web:2a7a12d2dd71639e083da5",
    measurementId: "G-6CX9H1Z5M8",
  };

  private app: FirebaseApp;
  private messaging: Messaging | null = null;

  constructor() {
    this.app = initializeApp(FirebaseService.firebaseConfig);
    if (typeof window !== "undefined") {
      this.messaging = getMessaging(this.app);
    }
  }

  private async registerServiceWorker(): Promise<void> {
    if (!("serviceWorker" in navigator)) {
      return;
    }
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );
    console.log("Service Worker registered:", registration);
    await navigator.serviceWorker.ready;
    console.log("Service Worker ready");
  }

  private async requestPermission(): Promise<boolean> {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission denied");
      return false;
    }
    return true;
  }

  private async getFirebaseToken(): Promise<string | null> {
    if (!this.messaging) return null;
    return getToken(this.messaging, { vapidKey: FirebaseService.VAPID_KEY });
  }

  private saveTokenToLocalStorage(token: string): void {
    localStorage.setItem(STORAGE_KEYS.FCM_TOKEN, token);
  }

  private async isSupported(): Promise<boolean> {
    return isSupported();
  }

  private async saveTokenToServer(token: string): Promise<void> {
    const storedToken = localStorage.getItem(STORAGE_KEYS.FCM_TOKEN);

    if (token !== storedToken) {
      const { error } = await saveFcmToken(token);
      if (!error) {
        this.saveTokenToLocalStorage(token);
        console.log("FCM token saved to server and local storage.");
      }
    }
  }

  private listenForForegroundMessages(): void {
    if (!this.messaging) return;
    onMessage(this.messaging, (payload) => {
      console.log("Foreground message received");
      const { notification } = payload;
      if (notification) {
        useToastStore.getState().addToast({
          title: notification.title || "New Notification",
          description: notification.body || "",
        });
      }
    });
  }

  public async setupForUnauthenticatedUser(): Promise<string | null> {
    if (typeof window === "undefined" || !this.messaging) {
      return null;
    }

    if (!this.isSupported()) {
      console.log("Firebase Messaging is not supported in this browser.");
      return null;
    }

    try {
      await this.registerServiceWorker();
      const permissionGranted = await this.requestPermission();
      if (!permissionGranted) return null;

      const token = await this.getFirebaseToken();
      if (token) {
        this.saveTokenToLocalStorage(token);
        this.listenForForegroundMessages();
      }
      return token;
    } catch (error) {
      console.error("Firebase setup error for unauthenticated user:", error);
      return null;
    }
  }

  public async setup(): Promise<string | null> {
    if (typeof window === "undefined" || !this.messaging) {
      return null;
    }

    if (!this.isSupported()) {
      console.log("Firebase Messaging is not supported in this browser.");
      return null;
    }

    try {
      await this.registerServiceWorker();
      const permissionGranted = await this.requestPermission();
      if (!permissionGranted) return null;

      const token = await this.getFirebaseToken();
      if (token) {
        await this.saveTokenToServer(token);
        this.listenForForegroundMessages();
      }

      return token;
    } catch (error) {
      console.error("Firebase setup error:", error);
      return null;
    }
  }
}

// Export a singleton instance of the service
export const firebaseService = new FirebaseService();
