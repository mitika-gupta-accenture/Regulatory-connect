'use server';

import { fetchService } from 'core/services/fetchService';
import { GET_CAM_USER_PERMISSIONS } from 'core/services/endPoints';
import { getAuthorizationToken } from 'core/services/apiService';

export default async function getUserPrivileges(
  personIdentifier: number,
  organisationId: number,
) {
  const params = `personIdentifier=${personIdentifier}&organisationId=${organisationId}`;
  const apiUrl = `${GET_CAM_USER_PERMISSIONS}?${params}`;
  const apiToken = await getAuthorizationToken(GET_CAM_USER_PERMISSIONS);

  try {
    const response = await fetchService.get(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiToken,
      },
    });
    return response;
  } catch (error) {
    console.error('Error during API request:', error);
  }
}
