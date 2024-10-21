'use server';
import { fetchService } from 'core/services/fetchService';
import { POST_CAM_CHANGE_USER_STATUS } from 'core/services/endPoints';
import { getAuthorizationToken } from 'core/services/apiService';

interface UserDetailsParams {
  primaryContactEmailAddress: string;
  organisationIdentifier: number;
  newWebUserAccountStatusName: string;
}

export default async function updateUserStatus(
  userDetails: UserDetailsParams,
  newWebUserAccountStatusName: string,
) {
  const params: UserDetailsParams = {
    primaryContactEmailAddress: userDetails.primaryContactEmailAddress,
    organisationIdentifier: userDetails.organisationIdentifier,
    newWebUserAccountStatusName: newWebUserAccountStatusName,
  };

  const apiToken = await getAuthorizationToken(POST_CAM_CHANGE_USER_STATUS);

  try {
    await fetchService.post(POST_CAM_CHANGE_USER_STATUS, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiToken,
      },
      body: JSON.stringify(params),
    });
  } catch (error) {
    console.error('Error during API request:', error);
  }
}
