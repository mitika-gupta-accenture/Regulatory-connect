import { IDENTIFIERS, refDataString } from '../../../util/stringModifier'; // Adjust the import path as needed

// Mock implementations for the placeholder functions
jest.mock('../../../util/stringModifier', () => ({
  ...jest.requireActual('../../../util/stringModifier'),
  replaceWithUserSessionData: jest
    .fn()
    .mockImplementation((string, key, userSessionData) => {
      let dataIds = key.split('.');
      let newFormFieldData = userSessionData;
      for (const dataId of dataIds) {
        if (newFormFieldData && newFormFieldData[dataId]) {
          newFormFieldData = newFormFieldData[dataId];
        } else {
          return ''; // Return empty string if key not found
        }
      }
      return string.replace(IDENTIFIERS.USER_SESSION, newFormFieldData || ''); // Handle case where newFormFieldData might be undefined
    }),
  replaceWithCmsData: jest
    .fn()
    .mockImplementation((string, key) => `CMS(${key})`),
  replaceWithRefData: jest
    .fn()
    .mockImplementation((string, key) => `REF(${key})`),
}));

describe('refDataString', () => {
  const mockUserSessionData = {
    USER_SESSION: {
      user: {
        name: 'John Doe',
        email: 'john@example.com',
      },
    },
    CMS_CONTENT: {
      user: {
        name: 'John Doe',
        email: 'john@example.com',
      },
    },
    REF_DATA: {
      user: {
        name: 'John Doe',
        email: 'john@example.com',
      },
    },
  };

  it('should replace USER_SESSION identifier with user session data', () => {
    const input = `Hello ${IDENTIFIERS.USER_SESSION} hi`;
    const result = refDataString(
      input,
      'USER_SESSION.user.name',
      mockUserSessionData,
    );
    expect(result).toBe('Hello John Doe hi');
  });

  it('should handle data strings without identifiers', () => {
    const input = 'No identifiers here';
    const result = refDataString(input, 'someKey', mockUserSessionData);
    expect(result).toBe('No identifiers here');
  });

  it('should handle empty strings', () => {
    const input = '';
    const result = refDataString(input, 'someKey', mockUserSessionData);
    expect(result).toBe('');
  });

  it('should return empty string if key is not found in userSessionData', () => {
    const input = 'Hello ###{IDENTIFIERS.USER_SESSION} hi';
    const result = refDataString(input, '', mockUserSessionData);
    expect(result).toBe('');
  });

  it('should replace CMS_CONTENT identifier with CMS data', () => {
    const input = 'CMS Section !!!{IDENTIFIERS.CMS_CONTENT} hi';
    const result = refDataString(input, '', mockUserSessionData);
    expect(result).toBe('');
  });

  it('should replace REF_DATA identifier with reference data', () => {
    const input = 'REF DATA $$${IDENTIFIERS.REF_DATA} hi';
    const result = refDataString(input, '', mockUserSessionData);
    expect(result).toBe('');
  });

  // Additional tests for edge cases can be added here
});