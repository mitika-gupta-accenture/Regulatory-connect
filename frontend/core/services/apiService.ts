import {
  createRequestBody,
  DataBodyType,
  oldUserDetails,
  selectedOrganisationDetails,
} from '../models/apiModel';
import endpointGroups from './endPoints';
import { fetchService, RequestType } from './fetchService';
import { getAllAnswersAction } from '../../app/actions';
import getAzureADTokenManager from './AzureADTokenManager';
import * as session from '../../core/models/redis';

function mergeObjects(objects: object[]): object {
  return objects.reduce((acc: any, obj: any) => {
    const merged = { ...acc, ...(obj.data ?? obj) };
    return merged;
  }, {});
}
export async function apiService<T>(apiGroupNames: string[]): Promise<object> {
  try {
    const answers = await getAllAnswersAction();
    let data: any = [];
    answers.forEach(obj => {
      if (obj.identifier) {
        data = [...data, ...obj.answers];
      }
    });
    const results: object[] = [];

    for (const groupName of apiGroupNames) {
      let result: object;

      if (groupName.startsWith('POST_')) {
        result = await invokePostRequests(groupName, data);
      } else {
        result = await invokeGetRequests(groupName);
      }

      results.push(result);
    }

    return mergeObjects(results);
  } catch (error) {
    console.error('An error occurred during API service execution');
    throw error;
  }
}

export async function getAuthorizationToken(
  groupName: string,
): Promise<string> {
  // Retrieve the Azure AD token using instance
  const AzureADInstance = await getAzureADTokenManager();
  const token: string | null = await AzureADInstance.getApiToken();
  if (typeof token !== 'string' || !token) {
    throw new Error(`Authorization token not found for group: ${groupName}.`);
  }
  return token;
}

export async function getUserSessionData() {
  const rawSessionData = (await session.get('userDetails')) as oldUserDetails;
  const selectedOrganisation = (await session.get(
    'selectedOrganisation',
  )) as selectedOrganisationDetails;
  const userSessionData: oldUserDetails = {
    ...rawSessionData,
    selectedOrganisation: selectedOrganisation,
  };
  return userSessionData;
}

export async function invokeGetRequests(groupName: string): Promise<object> {
  try {
    const apiToken = await getAuthorizationToken(groupName);
    const requests: RequestType[] = endpointGroups[groupName]?.map(
      endpoint => ({
        endpoint: endpoint,
        options: {
          headers: {
            Authorization: apiToken,
          },
        },
        apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
      }),
    );

    const data = (await fetchService.getCollection(requests)) as object[];
    return mergeObjects(data);
  } catch (error) {
    console.error(`Error during GET requests: ${groupName}`);
    throw new Error(
      `Failed to fetch data for group name: ${groupName}. ${
        error instanceof Error ? error.message : ''
      }`,
    );
  }
}

export async function invokePostRequests<T>(
  groupName: string,
  data: DataBodyType,
): Promise<object> {
  try {
    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error(
        `POST request requires data to be sent for: ${groupName}`,
      );
    }
    const userSessionData = await getUserSessionData();
    const requestBody = await createRequestBody(
      data,
      groupName,
      userSessionData,
    );

    const apiToken = await getAuthorizationToken(groupName);
    const endpoint = endpointGroups[groupName][0] ?? null;
    if (!endpoint) {
      throw new Error(
        `No endpoint found for POST requests in group: ${groupName}`,
      );
    }

    const response = await fetchService.post(
      endpoint,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: apiToken,
        },
        body: JSON.stringify(requestBody),
      },
      process.env.NEXT_PUBLIC_API_BASE_URL, // This needs to be changed to process.env.NEXT_PUBLIC_API_BASE_URL once POST API is available
    );
    // Check for valid response format
    if (typeof response !== 'object' || Object.keys(response).length === 0) {
      throw new Error('Invalid response format from POST request.');
    }

    return response;
  } catch (error) {
    console.error(`Error during POST request for group: ${groupName}`);
    throw new Error(
      `Failed to post data for group name : ${groupName}.${
        error instanceof Error ? error.message : ''
      }`,
    );
  }
}
