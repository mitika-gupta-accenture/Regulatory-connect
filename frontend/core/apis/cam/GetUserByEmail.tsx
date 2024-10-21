'use server';
import { fetchService } from 'core/services/fetchService';
import { GET_CAM_USER_STATUS_AND_ROLE } from 'core/services/endPoints';
import { UserDetails } from 'core/models/apiModel';
import { getAuthorizationToken } from 'core/services/apiService';

export default async function getUserByEmail(
  email: string,
): Promise<UserDetails | null> {
  const params = `email=${encodeURIComponent(email)}`;
  const apiUrl = `${GET_CAM_USER_STATUS_AND_ROLE}?${params}`;

  const apiToken = await getAuthorizationToken(GET_CAM_USER_STATUS_AND_ROLE);

  try {
    const response = await fetchService.get(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiToken,
      },
    });
    return response as UserDetails;
  } catch (error) {
    console.error('Error fetching email:', error);
    return null;
  }
}
