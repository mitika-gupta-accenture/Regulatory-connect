import { retrieveApiData } from 'core/util/retrieveApiData';
import * as session from '../../../models/redis';
import {
  apiService,
  getUserSessionData,
} from '../../../../core/services/apiService';

jest.mock('../../../../core/services/apiService', () => ({
  apiService: jest.fn(),
  getUserSessionData: jest.fn(),
}));

jest.mock('../../../models/redis', () => ({
  get: jest.fn(),
  set: jest.fn(),
}));

describe('retrieveApiData', () => {
  const apiGroupNames = ['group1', 'group2'];
  const mockData = { key: 'value' };
  const mockUserSessionData = { user: 'testUser' };
  const mockSelectedOrganisation = { org: 'testOrg' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return data when refData is cached', async () => {
    (session.get as jest.Mock).mockResolvedValueOnce(mockData);
    (session.get as jest.Mock).mockResolvedValueOnce(mockSelectedOrganisation);
    (getUserSessionData as jest.Mock).mockResolvedValueOnce(
      mockUserSessionData,
    );

    const result = await retrieveApiData(apiGroupNames);

    expect(session.get).toHaveBeenCalledWith(`refData_${apiGroupNames}`);
    expect(getUserSessionData).toHaveBeenCalled();
    expect(result).toEqual({
      ...mockData,
      microsoftUserDetails: {
        ...mockUserSessionData,
        selectedOrganisation: mockSelectedOrganisation,
      },
    });
  });

  it('should fetch and cache data when refData is not cached', async () => {
    (session.get as jest.Mock).mockResolvedValueOnce(null);
    (session.get as jest.Mock).mockResolvedValueOnce(mockSelectedOrganisation);
    (getUserSessionData as jest.Mock).mockResolvedValueOnce(
      mockUserSessionData,
    );
    (apiService as jest.Mock).mockResolvedValueOnce(mockData);

    const result = await retrieveApiData(apiGroupNames);

    expect(session.get).toHaveBeenCalledWith(`refData_${apiGroupNames}`);
    expect(apiService).toHaveBeenCalledWith(apiGroupNames);
    expect(session.set).toHaveBeenCalledWith(
      `refData_${apiGroupNames}`,
      mockData,
    );
    expect(result).toEqual({
      ...mockData,
      microsoftUserDetails: {
        ...mockUserSessionData,
        selectedOrganisation: mockSelectedOrganisation,
      },
    });
  });

  it('should return an empty object if apiGroupNames is not provided', async () => {
    const result = await retrieveApiData();

    expect(result).toEqual({});
  });

  it('should throw an error if there is an issue fetching data', async () => {
    (session.get as jest.Mock).mockRejectedValueOnce(new Error('Redis error'));

    await expect(retrieveApiData(apiGroupNames)).rejects.toThrow(
      'Failed to fetch data from apiService: Redis error',
    );
  });
});
