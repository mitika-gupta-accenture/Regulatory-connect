import { requiredValidator } from '../../../../core/validation/validators';

describe('requiredValidator', () => {
  const identifier = 'test';
  const expectedReason = 'required';

  it('should be valid with a non-empty string', () => {
    const answer = 'hello';
    const result = requiredValidator([
      {
        answer,
        identifier,
      },
    ]);
    expect(result.valid).toBeTruthy();
  });

  it('should be invalid with a empty string', () => {
    const answer = '';
    const result = requiredValidator([
      {
        answer,
        identifier,
      },
    ]);
    expect(result.valid).toBeFalsy();
    expect(result.reason).toBe(expectedReason);
  });

  it('should be invalid with an empty file', () => {
    const answer = { size: 0 };
    const result = requiredValidator([
      {
        answer: answer as File,
        identifier,
      },
    ]);
    expect(result.valid).toBeFalsy();
    expect(result.reason).toBe(expectedReason);
  });

  it('should be invalid with no answer', () => {
    const result = requiredValidator([]);
    expect(result.valid).toBeFalsy();
    expect(result.reason).toBe(expectedReason);
  });

  it('should be valid with a non-empty file', () => {
    const answer = { size: 1 };
    const result = requiredValidator([
      {
        answer: answer as File,
        identifier,
      },
    ]);
    expect(result.valid).toBeTruthy();
  });
});
