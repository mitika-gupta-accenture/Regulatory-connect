import { act } from '@testing-library/react';
import { getApplicationType, getLicenceNum, getCompaniesDetails, getCompanyDetails, getSubmissionTypeData, getDeclarationPageData } from '../applicationFormFieldsDataServices'; 
import * as apiService from '../apiService';
import { AxiosResponse } from 'axios';
import { setApplicationFormFieldsData } from '../../features/applicationFormFields/applicationFormFieldsSlice';
import { GET_APPLICATION_TYPE, GET_SUBMISSION_TYPE, GET_DECLARATION_PAGE_DATA, GET_COMPANY, GET_COMPANIES } from '../../constants/endpoints';

jest.mock('../apiService', () => ({
  _getCMSData: jest.fn(),
  _get: jest.fn()
}));

describe('getSubmissionTypeData', () => {
  let dispatchMock: jest.Mock;

  beforeEach(() => {
    dispatchMock = jest.fn();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getApplicationType with successful response', async () => {
    const responseData = { data: 'applicationTypeData' };
    const axiosResponse: AxiosResponse = {
      data: responseData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any
    };
    const _getSpy = jest.spyOn(apiService, '_get').mockResolvedValue(axiosResponse);
  
    await act(async () => {
      await getApplicationType(dispatchMock);
    });
  
    expect(_getSpy).toHaveBeenCalledWith(GET_APPLICATION_TYPE);
    expect(dispatchMock).toHaveBeenCalledWith(setApplicationFormFieldsData(responseData));
  });
  
  test('getApplicationType with null response', async () => {
    const axiosResponse: AxiosResponse = {
      data: null,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any
    };
    const _getSpy = jest.spyOn(apiService, '_get').mockResolvedValue(axiosResponse);
  
    await act(async () => {
      await getApplicationType(dispatchMock);
    });
  
    expect(_getSpy).toHaveBeenCalledWith(GET_APPLICATION_TYPE);
    // Ensure that dispatch was not called because of the null response
    expect(dispatchMock).not.toHaveBeenCalledWith(setApplicationFormFieldsData(expect.anything()));
  });

  test('getLicenceNum with other request', async () => {
    const responseData = { licenceNum: [] }; // Updated response data for the case when the request does not match 'a' or 'b'
    const axiosResponse: AxiosResponse = {
      data: responseData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any
    };
    const _getSpy = jest.spyOn(apiService, '_get').mockResolvedValue(axiosResponse);
    
    await act(async () => {
      await getLicenceNum(dispatchMock, 'other');
    });
    
    expect(_getSpy).not.toHaveBeenCalled(); // Ensure _get is not called with this request
    expect(dispatchMock).toHaveBeenCalledWith(setApplicationFormFieldsData(responseData));
  });

  test('getLicenceNum with "a" request', async () => {
    const responseData = { licenceNum: ['AA11', 'AA12'] };
    const axiosResponse: AxiosResponse = {
      data: responseData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any
    };
    const _getSpy = jest.spyOn(apiService, '_get').mockResolvedValue(axiosResponse);
    
    await act(async () => {
      await getLicenceNum(dispatchMock, 'abc');
    });
    
    expect(_getSpy).not.toHaveBeenCalled(); 
    expect(dispatchMock).not.toHaveBeenCalledWith(setApplicationFormFieldsData(responseData));
  });
  
  test('getLicenceNum with "b" request', async () => {
    const responseData = { licenceNum: ['BB12', 'BB13', 'BB14'] };
    const axiosResponse: AxiosResponse = {
      data: responseData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any
    };
    const _getSpy = jest.spyOn(apiService, '_get').mockResolvedValue(axiosResponse);
    
    await act(async () => {
      await getLicenceNum(dispatchMock, 'b');
    });
    expect(_getSpy).not.toHaveBeenCalled(); 
    expect(dispatchMock).toHaveBeenCalledWith(setApplicationFormFieldsData(responseData));
  });
  
  test('getLicenceNum with empty or undefined request', async () => {
    const responseData = { licenceNum: [] };
    const axiosResponse: AxiosResponse = {
      data: responseData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any
    };
    const _getSpy = jest.spyOn(apiService, '_get').mockResolvedValue(axiosResponse);
    
    await act(async () => {
      await getLicenceNum(dispatchMock, "licenceNum"); 
    });
    
    expect(_getSpy).not.toHaveBeenCalled(); 
    expect(dispatchMock).toHaveBeenCalledWith(setApplicationFormFieldsData(responseData));
  });
    
  test('getCompaniesDetails with successful response', async () => {
    const responseData = { data: 'companiesDetailsData' };
    const axiosResponse: AxiosResponse = {
      data: responseData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any
    };
    const _getSpy = jest.spyOn(apiService, '_get').mockResolvedValue(axiosResponse);
  
    await act(async () => {
      await getCompaniesDetails(dispatchMock);
    });
  
    expect(_getSpy).toHaveBeenCalledWith(GET_COMPANIES);
    expect(dispatchMock).toHaveBeenCalledWith(setApplicationFormFieldsData(responseData));
  });
  
  test('getCompaniesDetails with null response', async () => {
    const axiosResponse: AxiosResponse = {
      data: null,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any
    };
    const _getSpy = jest.spyOn(apiService, '_get').mockResolvedValue(axiosResponse);
  
    await act(async () => {
      await getCompaniesDetails(dispatchMock);
    });
  
    expect(_getSpy).toHaveBeenCalledWith(GET_COMPANIES);
    expect(dispatchMock).not.toHaveBeenCalledWith(setApplicationFormFieldsData(expect.anything()));
  });  

  test('getCompanyDetails', async () => {
    const responseData = { data: 'companyDetailsData' };
    const axiosResponse: AxiosResponse = {
      data: responseData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any 
    };
    const _getSpy = jest.spyOn(apiService, '_get').mockResolvedValue(axiosResponse);

    await act(async () => {
      await getCompanyDetails(dispatchMock);
    });

    expect(_getSpy).toHaveBeenCalledWith(GET_COMPANY);
    expect(dispatchMock).toHaveBeenCalledWith(setApplicationFormFieldsData(responseData));
  });
  
  test('getCompanyDetails with null response', async () => {
    const axiosResponse: AxiosResponse = {
      data: null,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any
    };
    const _getSpy = jest.spyOn(apiService, '_get').mockResolvedValue(axiosResponse);
  
    await act(async () => {
      await getCompanyDetails(dispatchMock);
    });
  
    expect(_getSpy).toHaveBeenCalledWith(GET_COMPANY);
    expect(dispatchMock).not.toHaveBeenCalledWith(setApplicationFormFieldsData(expect.anything()));
  });

  test('should fetch declaration page data and dispatch the correct action', async () => {
    const responseData = {
      data: {
        data: {
          attributes: 'declarationPageData'
        }
      }
    };
    (apiService._getCMSData as jest.Mock).mockResolvedValue(responseData);
    await act(async () => {
      await getDeclarationPageData(dispatchMock);
    });

    expect(apiService._getCMSData).toHaveBeenCalledWith(GET_DECLARATION_PAGE_DATA);
    expect(dispatchMock).toHaveBeenCalledWith(
      setApplicationFormFieldsData(responseData.data.data.attributes)
    );
  });
  
  test('getDeclarationPageData with invalid response format', async () => {
    const axiosResponse: AxiosResponse = {
      data: { invalidKey: 'declarationPageData' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any
    };
    const _getSpy = jest.spyOn(apiService, '_getCMSData').mockResolvedValue(axiosResponse);
  
    await act(async () => {
      await getDeclarationPageData(dispatchMock);
    });
  
    expect(_getSpy).toHaveBeenCalledWith(GET_DECLARATION_PAGE_DATA);
    // Ensure that dispatch was not called because of the invalid response format
    expect(dispatchMock).not.toHaveBeenCalledWith(setApplicationFormFieldsData(expect.anything()));
  });
  
  test('should fetch submission type data and dispatch the correct action', async () => {
    const responseData = {
      data: {
        data: {
          attributes: {
            submissionType: 'submissionTypeData'
          }
        }
      }
    };
    (apiService._getCMSData as jest.Mock).mockResolvedValue(responseData);
    await act(async () => {
      await getSubmissionTypeData(dispatchMock);
    });
  
    // Check if _getCMSData was called with the correct endpoint
    expect(apiService._getCMSData).toHaveBeenCalledWith(GET_SUBMISSION_TYPE);
  
    // Check if dispatch was called with the correct action
    expect(dispatchMock).toHaveBeenCalledWith(
      setApplicationFormFieldsData(responseData.data.data.attributes.submissionType)
    );
  });
  
  test('getSubmissionTypeData with null response', async () => {
    const axiosResponse: AxiosResponse = {
      data: null,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any
    };
    const _getCMSDataSpy = jest.spyOn(apiService, '_getCMSData').mockResolvedValue(axiosResponse);
  
    await act(async () => {
      await getSubmissionTypeData(dispatchMock);
    });
  
    expect(_getCMSDataSpy).toHaveBeenCalledWith(GET_SUBMISSION_TYPE);
    // Ensure that dispatch was not called because of the null response
    expect(dispatchMock).not.toHaveBeenCalledWith(setApplicationFormFieldsData(expect.anything()));
  });
  
  test('getSubmissionTypeData with invalid response format', async () => {
    const axiosResponse: AxiosResponse = {
      data: { invalidKey: 'submissionTypeData' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any
    };
    const _getCMSDataSpy = jest.spyOn(apiService, '_getCMSData').mockResolvedValue(axiosResponse);
  
    await act(async () => {
      await getSubmissionTypeData(dispatchMock);
    });
  
    expect(_getCMSDataSpy).toHaveBeenCalledWith(GET_SUBMISSION_TYPE);
    // Ensure that dispatch was not called because of the invalid response format
    expect(dispatchMock).not.toHaveBeenCalledWith(setApplicationFormFieldsData(expect.anything()));
  });
  
});