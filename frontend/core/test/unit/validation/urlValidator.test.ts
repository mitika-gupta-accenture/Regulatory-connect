import { urlValidator } from '../../../../core/validation/validators';

function cartesianProduct(sets: Array<Array<string>>) {
  return sets.reduce((acc, curr) =>
    acc.flatMap(elemA => curr.map(elemC => `${elemA}${elemC}`)),
  );
}

describe('urlValidator', () => {
  const validStarts = ['', 'http://', 'https://'];
  const validMiddle = [
    'google',
    'www.google',
    'subdomain.website',
    'abc',
    'www.abc',
  ];
  const validSuffix = ['.co', '.com', '.co.uk', '.shop', '.is', '.co.au'];
  const validEnd = [
    '',
    '/',
    '/page',
    '/page.htm',
    '/sub/page.aspx',
    '?referrer=https://google.com',
    '/page.html?query1=hello&query2=world&query3=some%20%url%20encoded%20string',
  ];

  const validPossibilities = cartesianProduct([
    validStarts,
    validMiddle,
    validSuffix,
    validEnd,
  ]);

  validPossibilities.forEach(url =>
    it(`should be valid: ${url}`, () => {
      const result = urlValidator([
        {
          answer: url,
          identifier: 'test',
        },
      ]);
      expect(result).toBeTruthy();
    }),
  );

  const invalid = [
    'word',
    'some sentence',
    'htpp:/notawebsite',
    'http://google.com with some extra text',
    'this website http://google.com',
    '132042390',
    'www.something.com <<< Click here',
  ];

  invalid.forEach(url =>
    it(`should not be valid: ${url}`, () => {
      const result = urlValidator([
        {
          answer: url,
          identifier: 'test',
        },
      ]);

      expect(result.valid).toBeFalsy();
    }),
  );

  it('should be valid with no answer', () => {
    const result = urlValidator([]);
    expect(result.valid).toBeTruthy();
  });

  // This should instead be handled by the 'required' validator
  it('should be valid with an empty URL', () => {
    const result = urlValidator([
      {
        answer: '',
        identifier: 'test',
      },
    ]);
    expect(result.valid).toBeTruthy();
  });
});
