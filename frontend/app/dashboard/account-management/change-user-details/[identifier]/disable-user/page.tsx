'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GridRow, GridCol, Button } from '@mhra/mhra-design-components';
import BackButton from 'core/util/BackButton';
import * as session from '../../../../../../core/models/redis';
import updateUserStatus from 'core/apis/cam/UpdateUserStatus';
import Link from 'next/link';

interface SelectedUserDetails {
  webUserName: string;
  primaryContactEmailAddress: string;
  organisationIdentifier: number;
  organisationName: string;
}

interface UserDetailsParams {
  webUserName: string;
  primaryContactEmailAddress: string;
  organisationIdentifier: number;
  newWebUserAccountStatusName: string;
}

function Page({ params }: { params: { identifier: string } }) {
  const [selectedUser, setSelectedUser] = useState<SelectedUserDetails | null>(
    null,
  );
  const router = useRouter();

  useEffect(() => {
    const getStoredDetails = async () => {
      try {
        const details = await session.get('changeUserDetails');
        if (typeof details === 'string') {
          setSelectedUser(JSON.parse(details) as SelectedUserDetails);
        }
      } catch (err) {
        console.error('Failed to retrieve details', err);
      }
    };

    void getStoredDetails();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (selectedUser) {
      const params: UserDetailsParams = {
        organisationIdentifier: selectedUser.organisationIdentifier,
        webUserName: selectedUser.webUserName,
        primaryContactEmailAddress: selectedUser.primaryContactEmailAddress,
        newWebUserAccountStatusName: 'Disabled',
      };

      try {
        await updateUserStatus(params, 'Disabled');
        router.push('/dashboard/account-management');
      } catch (err) {
        console.error('Failed to disable user', err);
      }
    }
  };

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <GridRow>
          <GridCol className="two-thirds">
            <div id="main-content" className="govuk-!-margin-top-4">
              <BackButton
                previousPage={`/dashboard/account-management/change-user-details/${params.identifier}`}
              />
              <h1 className="govuk-heading-xl">
                Confirm you want to disable this user{' '}
                <span className="govuk-caption-m govuk-!-margin-top-2">
                  {selectedUser?.organisationName}
                </span>
              </h1>
              <p className="govuk-body">
                Disabling this user will revoke their access to the product or
                service.
              </p>
              <table className="govuk-table organisation-details-table">
                <tbody className="govuk-table__body">
                  <tr className="govuk-table__row">
                    <th
                      scope="row"
                      className="govuk-table__header organisation-details-header govuk-!-width-one-third"
                    >
                      User status
                    </th>
                    <td className="govuk-table__cell">
                      <span className="govuk-tag govuk-tag--grey">
                        Disabled
                      </span>
                    </td>
                  </tr>

                  <tr className="govuk-table__row">
                    <th
                      scope="row"
                      className="govuk-table__header organisation-details-header govuk-!-width-one-third"
                    >
                      User name
                    </th>
                    <td className="govuk-table__cell organisation-details-cell">
                      {selectedUser?.webUserName}
                    </td>
                  </tr>
                  <tr className="govuk-table__row">
                    <th
                      scope="row"
                      className="govuk-table__header organisation-details-header govuk-!-width-one-third"
                    >
                      Email
                    </th>
                    <td className="govuk-table__cell organisation-details-cell">
                      {selectedUser?.primaryContactEmailAddress}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds govuk-!-padding-left-0">
                  <div className="govuk-grid-row">
                    <div className="govuk-grid-column-one-third govuk-!-padding-left-0">
                      <Button
                        id="confirm-button"
                        type="submit"
                        text="Confirm"
                        aria-label="Confirm"
                        data-cy="confirm-button"
                        data-testid="confirm-button"
                        className="govuk-button single-line-button"
                      ></Button>
                    </div>
                    <div>
                      <Link
                        href={`/dashboard/account-management/change-user-details/${params.identifier}`}
                      >
                        <Button
                          id="cancel-button"
                          type="button"
                          className="govuk-button govuk-button--secondary single-line-button"
                          text="Cancel"
                          aria-label="Cancel"
                          data-cy="cancel-button"
                          data-testid="cancel-button"
                        ></Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="govuk-grid-row govuk-!-padding-top-5 govuk-!-padding-bottom-5">
              <p>
                <Link
                  id="return-to-manage-user-access-link"
                  className="govuk-link"
                  aria-label="Return to Manage user access"
                  href={`/dashboard/account-management`}
                  rel="noreferrer noopener"
                  data-cy="return-to-manage-user-access-link"
                  data-testid="return-to-manage-user-access-link"
                >
                  Return to Manage user access
                </Link>
              </p>
            </div>
            <div className="govuk-grid-row govuk-!-padding-bottom-5">
              <p>
                <Link
                  id="new-tab-link"
                  className="govuk-link govuk-!-margin-top-5"
                  aria-label="Is this page not working properly (opens in new tab)?"
                  href="#"
                  rel="noreferrer noopener"
                  data-cy="new-tab-link"
                  target="_blank"
                  data-testid="new-tab-link"
                >
                  Is this page not working properly (opens in new tab)?
                </Link>
              </p>
            </div>
          </GridCol>
        </GridRow>
      </form>
    </main>
  );
}

export default Page;
