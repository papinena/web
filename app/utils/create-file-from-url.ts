/**
 * Creates a File object from a given URL.
 *
 * @param url The URL of the resource to fetch.
 * @param filename Optional: The name of the file. If not provided, it will be extracted from the URL.
 * @returns A Promise that resolves with the created File object.
 * @throws An error if the fetch request fails or the response is not OK.
 */
export async function createFileFromUrl(
  url: string,
  filename?: string
): Promise<File> {
  try {
    // Use a plain fetch, as Azure Blob SAS URLs have the token in the query string.
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const blob = await response.blob();
    const name = filename || url.split("/").pop()?.split("?")[0] || "downloaded-file";
    const file = new File([blob], name, { type: blob.type });
    return file;
  } catch (error) {
    console.error("Error creating file from URL:", error);
    throw error;
  }
}
