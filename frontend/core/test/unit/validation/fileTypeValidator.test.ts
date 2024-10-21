import { fileTypeValidator } from '../../../../core/validation/validators';

describe('fileTypeValidator', () => {
  const validFileTypes = [
    'image/png',
    'image/x-png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/pdf',
    'image/tiff',
    'image/jpeg',
  ];

  validFileTypes.forEach(fileType =>
    it(`should be valid with file type: ${fileType}`, () => {
      const result = fileTypeValidator([
        {
          answer: { type: fileType, size: 1 } as File,
          identifier: 'test',
        },
      ]);
      expect(result.valid).toBeTruthy();
    }),
  );

  const invalidFileTypes = [
    'not a real type',
    'video/H264',
    'video/mp4',
    'text/csv',
    'text/plain',
    'text/javascript',
    'multipart/encrypted',
    'audio/flac',
    'application/wasm',
    'application/vnd.sqlite3',
  ];
  invalidFileTypes.forEach(fileType =>
    it(`should be invalid for invalid filte type: ${fileType}`, () => {
      const result = fileTypeValidator([
        {
          answer: { type: fileType, size: 1 } as File,
          identifier: 'test',
        },
      ]);
      expect(result.valid).toBeFalsy();
    }),
  );
});
