'use client';

import { useEffect, useState } from 'react';
import { getCreatedUserByEmail } from './actions';
import * as session from 'core/models/redis';
import { Organisation } from 'core/models/apiModel';
import { NewUserDetails } from '../../add-new-user/page';

type CreatedUserType = {
  organisationRole?: string;
  userName?: string;
  email?: string;
  organisationName?: string;
};

const permissionDictionary = {
  '1': 'Admin',
  '2': 'Regulatory Manager',
  '3': 'Regulatory Contributor',
};

export default function Page({ params }: { params: { email: string } }) {
  const [selectedUser, setSelectedUser] = useState({} as CreatedUserType);

  const { email } = params;

  useEffect(() => {
    const getCreatedUserDetails = async () => {
      try {
        const newUserDetails = (await session.get(
          'newUserDetails',
        )) as NewUserDetails;
        const selectedOrganisation = (await session.get(
          'selectedOrganisation',
        )) as Organisation;
        const createdUser = (
          newUserDetails
            ? {
                organisationRole:
                  permissionDictionary[newUserDetails.permission],
                userName: `${newUserDetails.firstName} ${newUserDetails.lastName}`,
                email: newUserDetails.email,
                organisationName: selectedOrganisation.name,
              }
            : await getCreatedUserByEmail(email)
        ) as CreatedUserType;
        setSelectedUser(createdUser);
        await session.clearAnswer('newUserDetails');
      } catch (error) {
        console.error('cannot find created user ', error);
      }
    };

    void getCreatedUserDetails();
  }, [email]);

  return (
    <>
      <p className="govuk-body">
        Your invitation has been submitted. An email has been sent to the user.
      </p>
      <table className="govuk-table">
        <tbody className="govuk-table__body">
          <tr className="govuk-table__row">
            <th
              scope="row"
              className="govuk-table__header"
              style={{ fontWeight: 'normal' }}
            >
              Role
            </th>
            <td className="govuk-table__cell">
              {selectedUser.organisationRole || `Loading...`}
            </td>
          </tr>
          <tr className="govuk-table__row">
            <th
              scope="row"
              className="govuk-table__header"
              style={{ fontWeight: 'normal' }}
            >
              User name
            </th>
            <td className="govuk-table__cell">
              {selectedUser.userName || `Loading...`}
            </td>
          </tr>
          <tr className="govuk-table__row">
            <th
              scope="row"
              className="govuk-table__header"
              style={{ fontWeight: 'normal' }}
            >
              Email
            </th>
            <td className="govuk-table__cell">
              {selectedUser.email || `Loading...`}
            </td>
          </tr>
          <tr className="govuk-table__row">
            <th
              scope="row"
              className="govuk-table__header"
              style={{ fontWeight: 'normal' }}
            >
              Associated organisation
            </th>
            <td className="govuk-table__cell">
              {selectedUser.organisationName || `Loading...`}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
