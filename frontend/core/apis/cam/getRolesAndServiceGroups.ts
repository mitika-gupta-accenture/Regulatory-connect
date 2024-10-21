'use server';
import { fetchService } from 'core/services/fetchService';
import { GET_CAM_ROLES_SERVICE_GROUPS } from '../../../core/services/endPoints';
import { RolesAndServiceGroups } from 'core/models/apiModel';
import { getAuthorizationToken } from 'core/services/apiService';

export default async function getRolesAndServiceGroups() {
  const apiToken = await getAuthorizationToken(GET_CAM_ROLES_SERVICE_GROUPS);
  try {
    const response = await fetchService.get(GET_CAM_ROLES_SERVICE_GROUPS, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiToken,
      },
    });
    return response as RolesAndServiceGroups;
  } catch (error) {
    console.error('Error fetching fetching roles and service groups:', error);
    return null;
  }
}
