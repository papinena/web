import { authUtils } from "./auth";

export function api() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  return { BASE_URL };
}

/**
 * Create headers for API requests with optional authentication
 */
export function createApiHeaders(includeAuth = true): Headers {
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  if (includeAuth) {
    const authHeader = authUtils.getAuthHeader();
    if (authHeader) {
      headers.set("Authorization", authHeader);
    }
  }

  return headers;
}

/**
 * Make an authenticated API request
 */
export async function apiRequest(
  url: string,
  options: RequestInit = {},
  includeAuth = true
): Promise<Response> {
  const headers = createApiHeaders(includeAuth);
  
  // Merge headers with any existing headers in options
  const mergedHeaders = new Headers(headers);
  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        mergedHeaders.set(key, value);
      });
    } else if (typeof options.headers === "object") {
      Object.entries(options.headers).forEach(([key, value]) => {
        mergedHeaders.set(key, value);
      });
    }
  }

  return fetch(url, {
    ...options,
    headers: mergedHeaders,
  });
}
