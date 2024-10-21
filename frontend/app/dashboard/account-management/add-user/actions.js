'use server';

import assignOrganisationToUser from 'core/apis/cam/AssignOrganisationToUser';
import getUserByEmail from 'core/apis/cam/GetUserByEmail';
import * as session from 'core/models/redis';
import { redirect } from 'node_modules/next/navigation';

export const assignOrganisation = async (prevState, queryData) => {
  const permission = queryData.get('permissions');
  const personIdentifier = queryData.get('personIdentifier');
  const email = queryData.get('email');
  const currentOrganisation = await session.get('selectedOrganisation');

  await assignOrganisationToUser(
    Number(personIdentifier),
    Number(currentOrganisation.identifier),
    Number(permission),
    1008,
  );

  redirect(`/dashboard/account-management/user-added/${email}`);
};

export const searchUserByEmail = async email => {
  const selectedOrganisation = await session.get('selectedOrganisation');
  const searchedUser = await getUserByEmail(email);

  let returnObject = {
    foundAccount: !!searchedUser,
    searchPerformed: true,
  };

  if (searchedUser?.personIdentifier) {
    returnObject = {
      ...returnObject,
      personIdentifier: searchedUser.personIdentifier,
      email: searchedUser.primaryContactEmailAddress,
      userName: searchedUser.webUserName,
      existsInCurrentOrganisation: searchedUser?.organisations
        ? searchedUser.organisations.some(
            organisation =>
              organisation.identifier === selectedOrganisation.identifier,
          )
        : false,
    };
  }

  return returnObject;
};

export const searchUserByEmailForm = async (prevState, queryData) => {
  const email = queryData.get('emailSearch');

  const currentUser = await session.get('userDetails');
  console.log('logged in user:', currentUser);

  const searchedUser = await searchUserByEmail(email);

  return searchedUser;
};
