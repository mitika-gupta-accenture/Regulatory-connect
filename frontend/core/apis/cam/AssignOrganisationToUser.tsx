'use server';
import { fetchService } from 'core/services/fetchService';
import { POST_CAM_CREATE_WEB_USER_ACCOUNT_ROLE_AND_ORGANISATION_PERSON_ROLE } from 'core/services/endPoints';
import { getAuthorizationToken } from 'core/services/apiService';

interface UserAndOrgDetailsParams {
  personSk: number;
  organisationSk: number;
  webUserAccountRoleTypeSk: number;
  organisationPersonRoleTypeSk: number;
}

export default async function assignOrganisationToUser(
  personIdentifier: number,
  organisationIdentifier: number,
  webUserRoleIdentifier: number,
  organisationPersonRoleIdentifier: number,
) {
  const params: UserAndOrgDetailsParams = {
    webUserAccountRoleTypeSk: webUserRoleIdentifier,
    organisationSk: organisationIdentifier,
    personSk: personIdentifier,
    organisationPersonRoleTypeSk: organisationPersonRoleIdentifier,
  };

  console.log('Adding user to org, params:', params);

  const apiToken = await getAuthorizationToken(
    POST_CAM_CREATE_WEB_USER_ACCOUNT_ROLE_AND_ORGANISATION_PERSON_ROLE,
  );

  try {
    await fetchService.post(
      POST_CAM_CREATE_WEB_USER_ACCOUNT_ROLE_AND_ORGANISATION_PERSON_ROLE,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: apiToken,
        },
        body: JSON.stringify(params),
      },
    );

    console.log('API request successful');
  } catch (error) {
    console.error('Error during API request:', error);
  }
}
