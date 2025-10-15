import { authUtils } from "./auth";
import * as Sentry from "@sentry/react";

export function sendUserIdToNative() {
  try {
    // Check if the native message handler is available in the webkit environment
    if (
      window.webkit &&
      window.webkit.messageHandlers &&
      window.webkit.messageHandlers.authHeaderHandler
    ) {
      const authHeader = authUtils.getAuthHeader();
      if (authHeader) {
        console.log("Sending auth header to native:", authHeader);
        // The name 'authHeaderHandler' must match what you set in Swift
        window.webkit.messageHandlers.authHeaderHandler.postMessage(authHeader);
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
