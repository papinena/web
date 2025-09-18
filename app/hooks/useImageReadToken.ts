import { useImageTokenStore } from "~/stores/image-token";

export function useImageReadToken() {
  const { containerUri, sasToken, expiresOn } = useImageTokenStore();

  function buildUrl(filename?: string) {
    if (!filename) return "#";

    const isExternalUrl =
      filename.startsWith("http") || filename.startsWith("https");

    if (isExternalUrl) return filename;

    if (!containerUri || !sasToken) {
      return "";
    }

    const url = `${containerUri}/${filename}?${sasToken}`;

    return url;
  }

  return { buildUrl, containerUri, sasToken, expiresOn };
}
