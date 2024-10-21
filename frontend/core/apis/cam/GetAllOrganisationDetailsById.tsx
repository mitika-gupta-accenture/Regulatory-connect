'use server';
import { fetchService } from 'core/services/fetchService';
import { GET_CAM_ORGANISATION_DETAILS } from 'core/services/endPoints';
import { getAuthorizationToken } from 'core/services/apiService';

interface OrganisationDetailsResponse {
  organsationId?: string;
}

export default async function getAllOrganisationDetailsById(
  organisationId: string,
): Promise<OrganisationDetailsResponse | null> {
  const params = `organisationId=${encodeURIComponent(organisationId)}`;

  const apiUrl = `${GET_CAM_ORGANISATION_DETAILS}?${params}`;

  const apiToken = await getAuthorizationToken(GET_CAM_ORGANISATION_DETAILS);

  try {
    const response = await fetchService.get(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiToken,
      },
    });

    return response as OrganisationDetailsResponse;
  } catch (error) {
    console.error('Error fetching organisation details:', error);
    return null;
  }
}
