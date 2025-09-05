import { useState } from "react";

const STORAGE_KEY = "image-read-token";

export function useImageReadToken() {
  const [state] = useState<{
    expiresOn: "";
    sasToken: "";
    containerUri: "";
  }>(() => {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) return { sasToken: "", containerUri: "" };

    return JSON.parse(data);
  });

  function buildUrl(filename?: string) {
    if (!filename) return "#";

    const isExternalUrl =
      filename.startsWith("http") || filename.startsWith("https");

    if (isExternalUrl) return filename;

    return `${state.containerUri}/${filename}?${state.sasToken}`;
  }

  return { buildUrl, ...state };
}
