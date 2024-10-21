import { UserDetails } from 'core/models/apiModel';
import * as session from '../models/redis';
import { emailIsFound } from 'app/user-registration/actions';

interface EmailSearchResponse {
  accountExists: boolean;
  existsInOrg: boolean;
  userDetails: UserDetails;
}

export const checkIfMicrosoftEmailExistsInDatabase = async () => {
  const microsoftUserDetails = JSON.parse(
    (await session.get('microsoftUserDetails')) as string,
  );

  if (!!microsoftUserDetails) {
    try {
      //will set userDetails and selectedOrganisation if the user is found in DB + has an org
      const response = (await emailIsFound(microsoftUserDetails.email)) as EmailSearchResponse;
      return response;
    } catch (error) {
      console.error(
        'Unable to find microsfotUserDetails or set userDetails',
        error,
      );
    }
  }
};
