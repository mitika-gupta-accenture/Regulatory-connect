'use client';

import { Details, Button } from '@mhra/mhra-design-components';
import { useFormState } from 'react-dom';
import { searchUserByEmailForm } from './actions';
import Link from 'next/link';
import { AddUserSearchResult } from 'core/components/AddUserSearchResults';

export type SearchUserActionReturnType = {
  foundAccount: boolean;
  searchPerformed: boolean;
  personIdentifier?: number;
  email?: string;
  userName?: string;
  existsInCurrentOrganisation?: boolean;
};

const ActionButtons = ({
  searchedUser,
}: {
  searchedUser: SearchUserActionReturnType;
}) => {
  if (searchedUser.searchPerformed) {
    return (
      <div className="govuk-button-group">
        <Link
          href={
            searchedUser.foundAccount
              ? '/dashboard/account-management/add-user/' +
                  searchedUser.email || ''
              : '/dashboard/account-management/add-new-user'
          }
          id={'govuk-button-group-child'}
        >
          <Button
            name="continue-button"
            disabled={false}
            text={'Continue'}
            type="button"
          />
        </Link>
        <Link
          href="/dashboard/account-management"
          id={'govuk-button-group-child'}
        >
          <Button text={'Cancel'} buttonType="secondary" type="button" />
        </Link>
      </div>
    );
  }
  return <></>;
};

export default function Page() {
  const initialActionReturn: SearchUserActionReturnType = {
    foundAccount: false,
    searchPerformed: false,
    email: '',
  };

  const [actionReturn, formAction] = useFormState(
    searchUserByEmailForm,
    initialActionReturn,
  );

  return (
    <form className="govuk-form-group" action={formAction}>
      <div id="email-search-inputt" className="govuk-hint">
        You can only invite users that are already listed on the
        RegulatoryConnect database.
      </div>
      <input
        placeholder="jane.doe@companyname.com"
        className="govuk-input"
        id="email-search-input"
        name="emailSearch"
        type="text"
        aria-describedby="email-search-input"
      />

      <AddUserSearchResult searchedUser={actionReturn} confirmed={false} />
      <Details
        id="missing-user-guidance"
        heading="The user is missing"
        className=" govuk-!-padding-top-3"
      >
        <p className="govuk-body">
          If you cannot find the users email address, you will need to add them
          using our{' '}
          <a href="/dashboard/account-management/add-new-user">online form</a>{' '}
        </p>
      </Details>

      <ActionButtons searchedUser={actionReturn} />
    </form>
  );
}
