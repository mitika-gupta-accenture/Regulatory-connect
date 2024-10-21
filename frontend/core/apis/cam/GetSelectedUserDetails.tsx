'use server';
import * as session from '../../../core/models/redis';
import { fetchService } from 'core/services/fetchService';
import { getAuthorizationToken } from 'core/services/apiService';

import { GET_CAM_SELECTED_USER_DETAILS } from '../../../core/services/endPoints';
import { Organisation, SelectedUserDetails } from 'core/models/apiModel';

export async function getSelectedUserDetails(
  personIdentifier: number,
): Promise<SelectedUserDetails | null> {
  const apiToken = await getAuthorizationToken(GET_CAM_SELECTED_USER_DETAILS);
  const selectedOrganisation = (await session.get(
    'selectedOrganisation',
  )) as Organisation;
  const organisationId = selectedOrganisation.identifier;

  const params = `personIdentifier=${personIdentifier}&organisationId=${organisationId}`;
  const apiUrl = `${GET_CAM_SELECTED_USER_DETAILS}?${params}`;

  try {
    const response = await fetchService.get(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiToken,
      },
    });
    return response as SelectedUserDetails;
  } catch (error) {
    console.error('Error user details:', error);
    return null;
  }
}
