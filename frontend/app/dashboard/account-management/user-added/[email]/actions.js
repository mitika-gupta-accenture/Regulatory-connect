'use server';

import getUserByEmail from 'core/apis/cam/GetUserByEmail';
import * as session from '../../../../../core/models/redis';

export const getCreatedUserByEmail = async email => {
  const createdUserDetails = await getUserByEmail(email);
  const selectedOrganisation = await session.get('selectedOrganisation');

  if (createdUserDetails) {
    const createdUserOrganisationDetails =
      createdUserDetails.organisations.filter(
        organisation =>
          organisation.identifier === selectedOrganisation.identifier,
      )[0];

    const returnObject = {
      organisationRole: createdUserOrganisationDetails.webUserAccountRoleName,
      userName: createdUserDetails.webUserName,
      email: createdUserDetails.primaryContactEmailAddress,
      organisationName: selectedOrganisation.name,
    };

    return returnObject;
  }
};
