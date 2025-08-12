import { useEffect, useState } from "react";
import { requestForToken, onMessageListener } from "~/lib/firebase";

export function useFirebaseMessaging() {
  const [token, setToken] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    // Check if Firebase Messaging is supported
    const checkSupport = async () => {
      try {
        // Check for required APIs
        const isSupported =
          "serviceWorker" in navigator &&
          "PushManager" in window &&
          "Notification" in window;

        setIsSupported(isSupported);

        if (isSupported) {
          // Request permission
          const permission = await Notification.requestPermission();

          if (permission === "granted") {
            // Get FCM token
            const fcmToken = await requestForToken();
            setToken(fcmToken);

            // Listen for foreground messages
            try {
              await onMessageListener();
            } catch (error) {
              console.log("Error setting up message listener:", error);
            }
          } else {
            console.log("Notification permission denied");
          }
        }
      } catch (error) {
        console.error("Error checking Firebase Messaging support:", error);
        setIsSupported(false);
      }
    };

    checkSupport();
  }, []);

  return { token, isSupported };
}
