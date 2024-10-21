'use server';
import { fetchService } from 'core/services/fetchService';
import { POST_CAM_CREATE_USER } from 'core/services/endPoints';
import { getAuthorizationToken } from 'core/services/apiService';

interface UserDetailsParams {
  firstName: string;
  lastName: string;
  email: string;
}

export default async function insertUserDetails(userDetails: string) {
  let parsedUserDetails;

  const apiToken = await getAuthorizationToken(POST_CAM_CREATE_USER);

  try {
    parsedUserDetails = JSON.parse(userDetails);
  } catch (error) {
    console.error('Error parsing user details:', error);
    throw new Error('Invalid user details format');
  }

  const params: UserDetailsParams = {
    firstName: parsedUserDetails.firstName,
    lastName: parsedUserDetails.lastName,
    email: parsedUserDetails.email,
  };

  try {
    await fetchService.post(POST_CAM_CREATE_USER, {
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
