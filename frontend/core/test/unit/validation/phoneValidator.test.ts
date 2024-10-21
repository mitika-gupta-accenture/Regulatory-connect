import { phoneValidator } from '../../../../core/validation/validators';

describe('phoneValidator', () => {
  const validPossibilities = [
    '+44 1234567890',
    '1234567890',
    '(+44) 123 456 7890',
    '123 456 7890',
    '123-456-7890',
    '+44 123-456-789-0',
    '+1234567890',
  ];

  validPossibilities.forEach(number =>
    it(`should be valid: ${number}`, () => {
      const result = phoneValidator([
        {
          answer: number,
          identifier: 'test',
        },
      ]);
      expect(result).toBeTruthy();
    }),
  );

  const invalid = [
    'word',
    'one two three four five six seven eight nine ten',
    'phone number: 1234567890',
    'plus 44 then 1 2 3 4 5 6 7 8 9 0',
    '44=123=456=789=0',
    'UK 123 456 7890',
  ];

  invalid.forEach(number =>
    it(`should not be valid: ${number}`, () => {
      const result = phoneValidator([
        {
          answer: number,
          identifier: 'test',
        },
      ]);

      expect(result.valid).toBeFalsy();
    }),
  );

  it('should be valid with no answer', () => {
    const result = phoneValidator([]);
    expect(result.valid).toBeTruthy();
  });

  // This should instead be handled by the 'required' validator
  it('should be valid with an empty phone number', () => {
    const result = phoneValidator([
      {
        answer: '',
        identifier: 'test',
      },
    ]);
    expect(result.valid).toBeTruthy();
  });
});
