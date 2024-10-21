'use server';
import * as session from '../../core/models/redis';
import getUserByEmail from 'core/apis/cam/GetUserByEmail';

export const emailIsFound = async email => {
  const response = await getUserByEmail(email);

  if (response && !!response) {
    await session.set('userDetails', response);

    const hasOrganisations =
      response.organisations && response.organisations.length > 0;

    if (hasOrganisations && response.organisations.length === 1) {
      await session.set('selectedOrganisation', response.organisations[0]);
    }

    return {
      accountExists: true,
      userDetails: response,
      existsInOrg: hasOrganisations && !!response.organisations[0].identifier,
    };
  } else {
    return { accountExists: false, userDetails: null, existsInOrg: false };
  }
};
