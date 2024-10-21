import { fileSizeValidator } from '../../../../core/validation/validators';

describe('fileSizeValidator', () => {
  it('should be valid with a file < 5MiB', () => {
    const result = fileSizeValidator([
      {
        answer: { size: 5 * 1000000 - 1 } as File,
        identifier: 'test',
      },
    ]);
    expect(result.valid).toBeTruthy();
  });

  it('should be valid with a file = 5MiB', () => {
    const result = fileSizeValidator([
      {
        answer: { size: 5 * 1000000 } as File,
        identifier: 'test',
      },
    ]);
    expect(result.valid).toBeTruthy();
  });

  it('should be invalid with a file > 5MiB', () => {
    const result = fileSizeValidator([
      {
        answer: { size: 5 * 1000000 + 1 } as File,
        identifier: 'test',
      },
    ]);
    expect(result.valid).toBeFalsy();
    expect(result.reason).toBe('too-big');
  });

  it('should be valid with no answer', () => {
    const result = fileSizeValidator([]);
    expect(result.valid).toBeTruthy();
  });
});
