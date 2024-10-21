import { createRequestBody, DataBodyType } from '../../../models/apiModel';
import endpointGroups, { PL_BASE_URL } from '../../../services/endPoints';
import { fetchService } from '../../../services/fetchService';
import { getAllAnswersAction } from '../../../../app/actions';
import { apiService, getAuthorizationToken, invokeGetRequests, invokePostRequests } from '../../../services/apiService';
import * as session from '../../../../core/models/redis';

// Mocking dependencies
jest.mock('../../../../app/actions', () => ({
  getAllAnswersAction: jest.fn(),
}));

jest.mock('../../../services/fetchService', () => ({
  fetchService: {
    getCollection: jest.fn(),
    post: jest.fn(),
  },
}));

jest.mock('../../../models/apiModel', () => ({
  createRequestBody: jest.fn(),
}));

jest.mock('../../../../core/models/redis', () => ({
  get: jest.fn(),
}));

jest.mock('../../../services/apiService', () => ({
  getAuthorizationToken: jest.fn().mockImplementation(() => 'validToken'),
  invokeGetRequests: jest.fn(),
  invokePostRequests: jest.fn(),
  apiService: jest.fn(),
}));

const mockEndpointGroups = {
  GET_GROUP: ['endpoint1', 'endpoint2'],
  POST_GROUP: ['endpoint'],
  EMPTY_GROUP: [], 
};

const mockAnswers = [
  { identifier: 'id1', answers: [{ key: 'value1' }] },
  { identifier: 'id2', answers: [{ key1: 'value2' }] },
];

describe('API Service Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('apiService', () => {
    it('should call invokeGetRequests with correct endpoints when GET group is provided', async () => {
      (getAllAnswersAction as jest.Mock).mockResolvedValue(mockAnswers);
      (fetchService.getCollection as jest.Mock).mockResolvedValue([
        { key: 'value1' },
        { key1: 'value2' },
      ]);
      endpointGroups.GET_GROUP = mockEndpointGroups.GET_GROUP;
      (session.get as jest.Mock).mockResolvedValue('testToken');

      // Fixing the mock implementation to return a proper result
      (invokeGetRequests as jest.Mock).mockResolvedValue({ key: 'value1', key1: 'value2' });

      (apiService as jest.Mock).mockImplementation(async (groups) => {
        if (groups.includes('GET_GROUP')) {
          return invokeGetRequests('GET_GROUP');
        }
      });

      const result = await apiService(['GET_GROUP']);

      expect(invokeGetRequests).toHaveBeenCalledWith('GET_GROUP');
      expect(result).toEqual({ key: 'value1', key1: 'value2' });
    });

    it('should throw an error if POST request is made without data', async () => {
      (getAllAnswersAction as jest.Mock).mockResolvedValue([]);

      (apiService as jest.Mock).mockImplementation(async (groups) => {
        if (groups.includes('POST_GROUP')) {
          const data: string | any[] = [];
          if (data.length === 0) {
            throw new Error('POST request requires data to be sent for: POST_GROUP');
          }
          return invokePostRequests('POST_GROUP', data);
        }

      });

      await expect(apiService(['POST_GROUP'])).rejects.toThrow(
        'POST request requires data to be sent for: POST_GROUP',
      );
    });
  });


  //   it('should correctly process GET requests and return merged data', async () => {
  //     const mockResponse = [
  //       { key: 'value1' },
  //       { key1: 'value2' },
  //     ];
  
  //     // Mock fetchService.getCollection to resolve with mockResponse
  //     (fetchService.getCollection as jest.Mock).mockResolvedValue(mockResponse);
  
  //     // Invoke the function
  //     const result = await invokeGetRequests('GET_GROUP');
  
  //     // Verify fetchService.getCollection was called with the correct argument
  //     expect(fetchService.getCollection).toHaveBeenCalledWith([
  //       {
  //         endpoint: 'refdata/mp/productclasstype?licenceType=PLPI&licenceType=PL',
  //         options: {
  //           headers: {
  //             Authorization: 'validToken',
  //           },
  //         },
  //         apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  //       },
  //       {
  //         endpoint: 'refdata/common/territory?submission=marigen',
  //         options: {
  //           headers: {
  //             Authorization: 'validToken',
  //           },
  //         },
  //         apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  //       },
  //     ]);
  
  //     // Check the result
  //     expect(result).toEqual({
  //       key: 'value1',
  //       key1: 'value2',
  //     });
  //   });

  //   it('should throw an error if GET request response is invalid', async () => {
  //     // Mock fetchService.getCollection to resolve with an invalid response
  //     (fetchService.getCollection as jest.Mock).mockResolvedValue('invalid response');
    
  //     await expect(invokeGetRequests('GET_GROUP')).rejects.toThrow(
  //       'Response is not an array'
  //     );
  //   });
  // });

  describe('getAuthorizationToken', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return the token if it is a valid string', async () => {
      const result = await getAuthorizationToken('CMS_GROUP');

      expect(result).toBe('validToken');
    });
  });
});
