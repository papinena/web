import { api } from "./api";
import { authUtils } from "./auth";
import * as Sentry from "@sentry/react";

const apiUrl = api().BASE_URL;

/**
 * Sends the authorization header and API URL to the native iOS wrapper.
 * This function returns a promise that resolves only when the native side
 * confirms that it has successfully completed its asynchronous tasks
 * (e.g., fetching and sending the FCM token).
 *
 * @param header Optional authorization header string.
 * @returns A promise that resolves when the native process is complete.
 */
export function sendUserIdToNative(header?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // Check if the app is running within the iOS WKWebView environment
      if (
        window.webkit &&
        window.webkit.messageHandlers &&
        window.webkit.messageHandlers.authHeaderHandler
      ) {
        const authHeader = header ?? authUtils.getAuthHeader();

        if (!authHeader || !apiUrl) {
          const errorMessage =
            "Missing Auth Header or API URL. Cannot send config to native.";
          console.warn(errorMessage);
          return reject(new Error(errorMessage));
        }

        // 1. Create a unique callback function name to avoid collisions.
        const callbackName = `nativeCallback_${Date.now()}_${Math.random()
          .toString(36)
          .substring(2)}`;

        // 2. Set up a timeout to reject the promise if native code doesn't respond.
        const timeoutId = setTimeout(() => {
          console.error("Native callback timed out after 5000ms.");
          // Clean up the callback to prevent memory leaks.
          delete window[callbackName];
          reject(new Error("Native callback timed out."));
        }, 5000); // 5-second timeout

        // 3. Assign the resolver function to the window object.
        window[callbackName] = () => {
          console.log(
            "Native process completed successfully. Resolving promise."
          );
          // 5. Clean up the timeout and the window function upon success.
          clearTimeout(timeoutId);
          delete window[callbackName];
          resolve();
        };

        const payload = {
          authHeader,
          apiUrl,
          callbackName, // 4. Pass the callback name to the native side.
        };

        console.log(
          "Sending payload to native and awaiting callback:",
          payload
        );
        window.webkit.messageHandlers.authHeaderHandler.postMessage(payload);
      } else {
        console.log(
          "Not running in a native iOS wrapper with messaging capabilities."
        );
        // If not in a native environment, resolve immediately.
        resolve();
      }
    } catch (err) {
      Sentry.captureException(err);
      reject(err);
    }
  });
}
