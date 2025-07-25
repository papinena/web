export function api() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  return { BASE_URL };
}
