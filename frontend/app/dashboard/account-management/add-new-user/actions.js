'use server';

import assignOrganisationToUser from 'core/apis/cam/AssignOrganisationToUser';
import insertUserDetails from 'core/apis/cam/CreateUser';
import getUserByEmail from 'core/apis/cam/GetUserByEmail';
import * as session from 'core/models/redis';
import { validateFormData } from 'core/util/validateFormData';
import { redirect } from 'node_modules/next/navigation';

export const saveNewUserDetails = async (prevState, queryData) => {
  const email = queryData.get('email');
  const firstName = queryData.get('firstName');
  const lastName = queryData.get('lastName');

  const permission = queryData.get('permissions');

  const currentOrganisation = await session.get('selectedOrganisation');

  const errorMessages = validateFormData({
    firstName: firstName,
    lastName: lastName,
    email: email,
  });

  if (!errorMessages.length && permission) {
    const newUserDetails = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      permission: permission,
      organisationIdentifier: currentOrganisation.identifier,
    };

    const searchedUser = await getUserByEmail(email);

    const userExistsInCurrentOrganisation = searchedUser?.organisations
      ? searchedUser.organisations.some(
          organisation =>
            organisation.identifier === currentOrganisation.identifier,
        )
      : false;

    if (userExistsInCurrentOrganisation) {
      redirect(`/dashboard/account-management/add-user/${email}`);
    } else {
      await session.set('newUserDetails', newUserDetails);

      redirect('/dashboard/account-management/add-new-user/confirm');
    }
  } else {
    return errorMessages;
  }
};

const insertIntoUsersAndOrganisation = async newUserDetails => {
  try {
    if (newUserDetails?.email) {
      await insertUserDetails(JSON.stringify(newUserDetails))
        .then(async () => {
          const createdUserDetails = await getUserByEmail(newUserDetails.email);
          return createdUserDetails;
        })
        .then(async createdUserDetails => {
          if (createdUserDetails?.personIdentifier) {
            await assignOrganisationToUser(
              Number(createdUserDetails.personIdentifier),
              Number(newUserDetails.organisationIdentifier),
              Number(newUserDetails.permission),
              1008,
            );

            return createdUserDetails;
          }
        });
    }
  } catch (error) {
    await session.clearAnswer('newUserDetails');
    console.error('Error adding new user:', error);
    redirect(`/access-denied`);
  }
};

export const createNewUserAndAssign = async () => {
  const newUserDetails = await session.get('newUserDetails');

  await insertIntoUsersAndOrganisation(newUserDetails).finally(
    redirect(
      `/dashboard/account-management/user-added/${newUserDetails.email}`,
    ),
  );
};
