import { api } from "./api";
import { authUtils } from "./auth";
import * as Sentry from "@sentry/react";

const apiUrl = api().BASE_URL;

export function sendUserIdToNative(header?: string) {
  try {
    // Check if the native message handler is available in the webkit environment
    if (
      window.webkit &&
      window.webkit.messageHandlers &&
      window.webkit.messageHandlers.authHeaderHandler
    ) {
      const authHeader = header ?? authUtils.getAuthHeader();

      // Ensure both are available before sending
      if (!authHeader || !apiUrl) {
        console.warn(
          "Missing Auth Header or API URL. Cannot send config to native."
        );
        return;
      }

      const payload = {
        authHeader,
        apiUrl,
      };

      if (authHeader) {
        console.log("Sending payload to native:", payload);
        // The name 'authHeaderHandler' must match what you set in Swift
        window.webkit.messageHandlers.authHeaderHandler.postMessage(payload);
      } else {
        console.warn("User ID not found in local storage.");
      }
    } else {
      console.log(
        "Not running in a native iOS wrapper with messaging capabilities."
      );
    }
  } catch (err) {
    Sentry.captureException(err);
  }
}
