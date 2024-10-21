'use server';
import { fetchService } from 'core/services/fetchService';
import { POST_CAM_UPDATE_USER_ROLES } from 'core/services/endPoints';
import { getAuthorizationToken } from 'core/services/apiService';

export default async function updateUserRoles(
  addRoles: string[],
  removeRoles: string[],
  webUserID: string,
  orgID: number,
) {
  const params = {
    addRoles: addRoles,
    removeRoles: removeRoles,
    webUserId: webUserID,
    orgId: orgID,
  };
  const apiToken = await getAuthorizationToken(POST_CAM_UPDATE_USER_ROLES);

  try {
    await fetchService.post(POST_CAM_UPDATE_USER_ROLES, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiToken,
      },
      body: JSON.stringify(params),
    });

    console.log('API request successful');
  } catch (error) {
    console.error('Error during API request:', error);
  }
}
