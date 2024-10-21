'use client';

import { Button } from '@mhra/mhra-design-components';
import { assignOrganisation, searchUserByEmail } from '../actions';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { SearchUserActionReturnType } from '../page';
import { redirect } from 'next/navigation';
import { AddUserSearchResult } from '../../../../../core/components/AddUserSearchResults';

const ActionButtons = ({
  searchedUser,
}: {
  searchedUser: SearchUserActionReturnType;
}) => {
  if (searchedUser.searchPerformed) {
    return (
      <div className="govuk-button-group">
        {!searchedUser.existsInCurrentOrganisation && (
          <div>
            <Button
              name="continue-button"
              disabled={false}
              text={'Submit'}
              type="submit"
            />
          </div>
        )}

        <Link href="/dashboard/account-management" id={'cancel-link'}>
          <Button
            text={'Cancel'}
            buttonType={
              searchedUser.existsInCurrentOrganisation ? 'primary' : 'secondary'
            }
            type="button"
          />
        </Link>
      </div>
    );
  }
  return <></>;
};

export default function Page({ params }: { params: { email: string } }) {
  const initialActionReturn = {};

  const initialUser: SearchUserActionReturnType = {
    foundAccount: true,
    searchPerformed: false,
  };

  const [actionReturn, formAction] = useFormState(
    assignOrganisation,
    initialActionReturn,
  );

  const [selectedUser, setSelectedUser] = useState(initialUser);

  const { email } = params;

  useEffect(() => {
    const searchForUser = async () => {
      try {
        const result = await searchUserByEmail(email);
        setSelectedUser(result);
      } catch (error) {
        console.error(
          'Error getting or setting selectedUser from searchUserByEmail:',
          error,
        );
      }
    };

    if (!selectedUser.searchPerformed) {
      void searchForUser();
    }

    if (!selectedUser.foundAccount) {
      redirect('/dashboard/account-management/add-user');
    }
  }, [selectedUser, email, actionReturn]);

  if (selectedUser.searchPerformed) {
    return (
      <form action={formAction}>
        {/* Hidden input to pass personIdentifier to server action */}
        <input
          value={selectedUser.personIdentifier}
          hidden={true}
          readOnly={true}
          type="text"
          name="personIdentifier"
          id="personIdentifier"
        />
        {/* Hidden input to pass email to server action */}
        <input
          value={selectedUser.email}
          hidden={true}
          readOnly={true}
          type="text"
          name="email"
          id="email"
        />

        <AddUserSearchResult searchedUser={selectedUser} confirmed={true} />

        {selectedUser.existsInCurrentOrganisation ? (
          <>
            <h1 className="govuk-heading-l">User already exists</h1>
            <p className="govuk-body">
              The user you selected already belongs to your organisation. If you
              would like to change their user details, or update their
              permissions, visit the{' '}
              <a
                href={`/dashboard/account-management/change-user-details/${selectedUser.personIdentifier}`}
              >
                change user details screen
              </a>
              .
            </p>
          </>
        ) : (
          <>
            {' '}
            <h1 className="govuk-heading-l">Assign user role</h1>
            <div className="govuk-form-group">
              <label className="govuk-label" htmlFor="permissions">
                User permission
              </label>

              <select
                className="govuk-select"
                id="permissions"
                name="permissions"
                defaultValue={'Contributor'}
              >
                <option value="1">Admin</option>
                <option value="2">Regulatory Manager</option>
                <option value="3">Regulatory Contributor</option>
              </select>
            </div>
            <p className="govuk-body">
              Once the user has been associated with your organisation, you can
              assign them to a service group on the Manage user permissions
              page. For example, if they have a contributor role, you can assign
              them to medicinal products, supply chain or medical devices.
            </p>
          </>
        )}
        <ActionButtons searchedUser={selectedUser} />
      </form>
    );
  }
  return;
}
