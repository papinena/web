import { create } from "zustand";

const STORAGE_KEY = "image-read-token";

interface ImageTokenState {
  sasToken: string;
  containerUri: string;
  expiresOn: string;
  setToken: (data: {
    sasToken: string;
    containerUri: string;
    expiresOn: string;
  }) => void;
}

function getInitialState() {
  if (typeof window === "undefined") {
    return { sasToken: "", containerUri: "", expiresOn: "" };
  }
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    return { sasToken: "", containerUri: "", expiresOn: "" };
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return { sasToken: "", containerUri: "", expiresOn: "" };
  }
}

export const useImageTokenStore = create<ImageTokenState>((set) => ({
  ...getInitialState(),
  setToken: (data) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
    set(data);
  },
}));
