import {
  getFlowSpecificRequestBody,
  getUserDetailsRequestBody,
  createRequestBody,
} from 'core/models/apiModel';
import * as session from '../../../models/redis';

jest.mock('../../../../core/models/redis', () => ({
  get: jest.fn(),
}));

describe('API Functions', () => {
  const mockData = [
    { answer: '1', identifier: 'applicationTypeIdentifier', code: '2' },
    { answer: '251', identifier: 'territoryIdentifier', code: '2' },
    { answer: '3', identifier: 'count', code: '2' },
  ];

  const mockUserSessionData = {
    personIdentifier: 123,
    primaryContactEmailAddress: 'test@example.com',
    webUserAccountRoleName: 'User',
    webUserAccountStatusName: 'Active',
    selectedOrganisation: {
      identifier: 456,
      name: 'Test Org',
      webUserAccountRoleName: 'User',
      mhraOrgIdentity: '789',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getFlowSpecificRequestBody', () => {
    it('should return correct request body for POST_PL_NUMBER_GENERATION', async () => {
      (session.get as jest.Mock).mockResolvedValue({
        territory: [{ identifier: 1, code: 251, name: 'UK', isActive: 'Y' }],
      });

      const result = await getFlowSpecificRequestBody(
        'POST_PL_NUMBER_GENERATION',
        mockData,
      );

      expect(result).toEqual({
        territoryIdentifier: 1,
        applicationTypeIdentifier: 1,
        count: 3,
      });
    });
  });

  describe('getUserDetailsRequestBody', () => {
    it('should return correct user details for POST_PL_GENERATE_DOSSIER_ID', () => {
      const result = getUserDetailsRequestBody(
        mockUserSessionData,
        'POST_PL_GENERATE_DOSSIER_ID',
      );

      expect(result).toEqual({
        personIdentifier: 123,
        organisationIdentifier: 456,
      });
    });

    it('should return correct user details for default case', () => {
      const result = getUserDetailsRequestBody(
        mockUserSessionData,
        'OTHER_API_CALL',
      );

      expect(result).toEqual({
        personIdentifier: 123,
        mhraOrganisationIdentifier: 789,
        organisationIdentifier: 456,
      });
    });
  });

  describe('createRequestBody', () => {
    it('should combine flow specific and user details request bodies', async () => {
      (session.get as jest.Mock).mockResolvedValue({
        territory: [{ identifier: 1, code: 251, name: 'UK', isActive: 'Y' }],
      });

      const result = await createRequestBody(
        mockData,
        'POST_PL_NUMBER_GENERATION',
        mockUserSessionData,
      );

      expect(result).toEqual({
        territoryIdentifier: 1,
        applicationTypeIdentifier: 1,
        count: 3,
        personIdentifier: 123,
        mhraOrganisationIdentifier: 789,
        organisationIdentifier: 456,
      });
    });
  });
});
