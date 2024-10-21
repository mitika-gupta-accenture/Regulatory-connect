import { BlobServiceClient } from '@azure/storage-blob';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const func_app = process.env.FUNC_NAME_BLOB_ACCESS;

async function uploadFileAzure(
  buffer: ArrayBuffer,
  blobName: string,
  contentType: string,
  connectionString: string,
) {
  const client = BlobServiceClient.fromConnectionString(connectionString);

  const containerClient = client.getContainerClient(
    process.env.BLOB_CONTAINER_NAME!,
  );

  await containerClient.createIfNotExists();

  const blobClient = containerClient.getBlobClient(blobName);
  const blockBlobClient = blobClient.getBlockBlobClient();

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: { blobContentType: contentType },
  });

  return {
    blobHost: `https://${func_app}.azurewebsites.net/api/get-file`,
  };
}

export async function uploadFile(
  buffer: ArrayBuffer,
  blobName: string,
  contentType: string,
) {
  if (
    process.env.BLOB_STORAGE_CONNECTION_STRING &&
    process.env.USE_LOCAL_FILE_UPLOAD !== 'true'
  ) {
    return await uploadFileAzure(
      buffer,
      blobName,
      contentType,
      process.env.BLOB_STORAGE_CONNECTION_STRING,
    );
  } else if (process.env.USE_LOCAL_FILE_UPLOAD === 'true') {
    const fileUploadLocation = 'file-uploads';
    const basePath = path.join(process.cwd(), fileUploadLocation);
    if (!existsSync(basePath)) {
      await mkdir(basePath);
    }

    await writeFile(path.join(basePath, blobName), Buffer.from(buffer));
    return { blobHost: basePath };
  } else {
    console.warn(
      'WARN: Neither blob storage connection or local file upload was set - check environment',
    );
  }
}
