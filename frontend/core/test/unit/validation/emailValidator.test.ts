import { emailValidator } from '../../../../core/validation/validators';

function cartesianProduct(sets: Array<Array<string>>) {
  return sets.reduce((acc, curr) =>
    acc.flatMap(elemA => curr.map(elemC => `${elemA}${elemC}`)),
  );
}

describe('emailValidator', () => {
  const validStarts = ['start', 'valid.start', 'valid-start'];
  const validMiddle = ['@'];
  const validDomain = ['test', 'google', 'email', 'crazy-mail'];
  const validSuffix = ['.co', '.com', '.co.uk', '.shop', '.is', '.co.au'];

  const validPossibilities = cartesianProduct([
    validStarts,
    validMiddle,
    validDomain,
    validSuffix,
  ]);

  validPossibilities.forEach(email =>
    it(`should be valid: ${email}`, () => {
      const result = emailValidator([
        {
          answer: email,
          identifier: 'test',
        },
      ]);
      expect(result).toBeTruthy();
    }),
  );

  const invalid = [
    'word',
    'some sentence',
    '@notanemail@',
    'my@email.com@test.com',
    'this email test@email.com',
    '@@@@',
    '123456789',
    'test@@email..com',
  ];

  invalid.forEach(email =>
    it(`should not be valid: ${email}`, () => {
      const result = emailValidator([
        {
          answer: email,
          identifier: 'test',
        },
      ]);

      expect(result.valid).toBeFalsy();
    }),
  );

  it('should be valid with no answer', () => {
    const result = emailValidator([]);
    expect(result.valid).toBeTruthy();
  });

  // This should instead be handled by the 'required' validator
  it('should be valid with an empty email', () => {
    const result = emailValidator([
      {
        answer: '',
        identifier: 'test',
      },
    ]);
    expect(result.valid).toBeTruthy();
  });
});
