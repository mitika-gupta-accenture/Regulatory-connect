'use server';
import { fetchService } from 'core/services/fetchService';
import { GET_CAM_ORGANISATIONS_USERS } from 'core/services/endPoints';
import { getAuthorizationToken } from 'core/services/apiService';

interface UserDetailsResponse {
  organsationId?: string;
}

export default async function GetAllOrganisationUsersByOrganisationId(
  organisationId: string,
): Promise<UserDetailsResponse | null> {
  const params = `organisationId=${encodeURIComponent(organisationId)}`;

  const apiUrl = `${GET_CAM_ORGANISATIONS_USERS}?${params}`;

  const apiToken = await getAuthorizationToken(GET_CAM_ORGANISATIONS_USERS);

  try {
    const response = await fetchService.get(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiToken,
      },
    });

    return response as UserDetailsResponse;
  } catch (error) {
    console.error('Error fetching user details:', error);
    return null;
  }
}
