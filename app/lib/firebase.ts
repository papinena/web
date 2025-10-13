import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
  type Messaging,
} from "firebase/messaging";
import {
  getAuth,
  signInWithPopup,
  OAuthProvider,
  type Auth,
} from "firebase/auth";
import { STORAGE_KEYS } from "~/utils/constants";
import { saveFcmToken } from "~/services/save-fcm-token";
import { useToastStore } from "~/stores/toast";

class FirebaseService {
  private static readonly VAPID_KEY =
    "BLUHIezlVHMW-Sm1Be_Lr9Qo5PAxovbIkApE-y3jHsKSVK838-u5xu4JcsUX6h0s-o499IIoPV4JJy1rCT6RmeQ";

  private static readonly firebaseConfig = {
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    apiKey: "AIzaSyDuKNBlDUJ3lPtUWsqV3k2vQqfyNOVt1Uk",
    authDomain: "vizis-bcec0.firebaseapp.com",
    projectId: "vizis-bcec0",
    storageBucket: "vizis-bcec0.firebasestorage.app",
    messagingSenderId: "27581590959",
    appId: "1:27581590959:web:92d6c6840d2c942c15d35a",
    measurementId: "G-LTHCZX4THN",
  };

  private app: FirebaseApp;
  private messaging: Messaging | null = null;
  private auth: Auth;
  private token: string | null | undefined;

  constructor() {
    this.app = initializeApp(FirebaseService.firebaseConfig);
    this.auth = getAuth(this.app);
    if (typeof window !== "undefined") {
      this.messaging = getMessaging(this.app);
    }
  }

  public async signInWithApple(): Promise<string | null> {
    const provider = new OAuthProvider("apple.com");
    try {
      const result = await signInWithPopup(this.auth, provider);
      const idToken = await result.user.getIdToken();
      return idToken;
    } catch (error) {
      console.error("Apple sign-in error:", error);
      return null;
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
      const { notification, data } = payload;

      let url;

      if (data?.postId) {
        url = `/post/admin/${data.postId}`;
      }

      if (notification) {
        useToastStore.getState().addToast({
          title: notification.title || "New Notification",
          description: notification.body || "",
          url,
        });
      }
    });
  }

  public async setupForUnauthenticatedUser(): Promise<string | null> {
    if (this.token !== undefined) {
      return this.token;
    }
    if (typeof window === "undefined" || !this.messaging) {
      this.token = null;
      return null;
    }

    if (!(await this.isSupported())) {
      console.log("Firebase Messaging is not supported in this browser.");
      this.token = null;
      return null;
    }

    try {
      await this.registerServiceWorker();
      const permissionGranted = await this.requestPermission();
      if (!permissionGranted) {
        this.token = null;
        return null;
      }

      const token = await this.getFirebaseToken();
      this.token = token;
      if (this.token) {
        this.saveTokenToLocalStorage(this.token);
        this.listenForForegroundMessages();
      }

      console.log("Firebase initialized");

      return this.token;
    } catch (error) {
      console.error("Firebase setup error for unauthenticated user:", error);
      this.token = null;
      return null;
    }
  }

  public async setup(): Promise<string | null> {
    if (this.token !== undefined) {
      return this.token;
    }
    if (typeof window === "undefined" || !this.messaging) {
      this.token = null;
      return null;
    }

    if (!(await this.isSupported())) {
      console.log("Firebase Messaging is not supported in this browser.");
      this.token = null;
      return null;
    }

    try {
      await this.registerServiceWorker();
      console.log("FIREBASE: CHECKING PERMISSIONS");
      const permissionGranted = await this.requestPermission();

      if (!permissionGranted) {
        this.token = null;
        return null;
      }

      const token = await this.getFirebaseToken();
      this.token = token;
      if (this.token) {
        await this.saveTokenToServer(this.token);
        this.listenForForegroundMessages();
      }

      console.log("FIREBASE: INITIALIZED");

      return this.token;
    } catch (error) {
      console.error("Firebase setup error:", error);
      this.token = null;
      return null;
    }
  }
}

// Export a singleton instance of the service
export const firebaseService = new FirebaseService();
