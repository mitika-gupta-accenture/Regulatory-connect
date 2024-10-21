'use server';

import * as session from '../core/models/redis';
import { uploadFile } from '../core/services/file-service';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export async function processFileAnswer(identifier, answer) {
  const contentType = answer.type || 'application/octet-stream';
  const fullFileName = answer.name.trim().replaceAll(' ', '_');
  const name = path.parse(fullFileName).name;
  const ext = path.parse(fullFileName).ext;
  const blobId = uuidv4();
  const buffer = await answer.arrayBuffer();

  const today = new Date();
  const dateStr = today.toLocaleDateString().replaceAll('/', '-');

  const blobName = `${name}_${dateStr}_${blobId.substring(0, 8)}${ext}`;

  const { blobHost } = await uploadFile(buffer, blobName, contentType);

  await session.setOrAppendFile({
    identifier,
    fileName: fullFileName,
    contentType,
    blobName,
    url: `${blobHost}/${blobName}`,
  });
}

export async function removeFiles(questionId) {
  const files = await session.getFiles();
  const questionFiles = files.filter(f => f.identifier === questionId);
  for (const file of questionFiles) {
    await session.deleteFile(file.blobName);
  }
}
