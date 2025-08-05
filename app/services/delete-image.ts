import { BlobServiceClient } from "@azure/storage-blob";

export async function deleteImage(
  containerUri: string,
  sasToken: string,
  blobUrl: string
) {
  const blobServiceClient = new BlobServiceClient(
    `${containerUri}?${sasToken}`
  );
  const containerClient = blobServiceClient.getContainerClient("");
  const blobName = new URL(blobUrl).pathname.split("/").pop();

  if (blobName) {
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.delete();
  }
}
