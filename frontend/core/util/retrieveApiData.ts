import { apiService, getUserSessionData } from 'core/services/apiService';
import * as session from '../../core/models/redis';

export async function retrieveApiData(apiGroupNames?: string[]) {
  if (!apiGroupNames) return {};

  try {
    const [refData, userSessionData] = await Promise.all([
      session.get(`refData_${apiGroupNames}`),
      getUserSessionData(),
    ]);

    const data = refData ?? (await apiService(apiGroupNames));
    if (!refData) {
      await session.set(`refData_${apiGroupNames}`, data);
    }

    const userDetails = userSessionData ?? {};
    const selectedOrganisation = await session.get('selectedOrganisation');
    return {
      ...data,
      microsoftUserDetails: { ...userDetails, selectedOrganisation}
    };
  } catch (error) {
    throw new Error(
      `Failed to fetch data from apiService: ${(error as Error).message}`,
    );
  }
}
