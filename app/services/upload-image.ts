import { BlobServiceClient } from '@azure/storage-blob';

export async function uploadImage(
  containerUri: string,
  sasToken: string,
  file: File,
) {
  const blobServiceClient = new BlobServiceClient(`${containerUri}?${sasToken}`);
  const containerClient = blobServiceClient.getContainerClient('');
  const blobName = new Date().getTime() + '-' + file.name;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadData(file);

  return blockBlobClient.url;
}
