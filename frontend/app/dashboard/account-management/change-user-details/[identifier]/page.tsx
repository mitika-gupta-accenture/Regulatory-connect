'use client';

import { useState, useEffect } from 'react';
import {
  GridRow,
  GridCol,
  Button,
  Details,
} from '@mhra/mhra-design-components';
import { getSelectedUserDetails } from 'core/apis/cam/GetSelectedUserDetails';

import BackButton from 'core/util/BackButton';
import Link from 'next/link';
import * as session from '../../../../../core/models/redis';
import {
  Organisation,
  UserDetails,
  SelectedUserDetails,
} from 'core/models/apiModel';
import { UserRoles } from './UserRoles';
import { updateUserRoleAction } from './updateUserRole';
import { useFormState } from 'react-dom';

const errorState = {
  roleError: '',
  serviceGroupError: '',
};

function Page({ params }: { params: { identifier: string } }) {
  const [selectedUserDetails, setSelectedUserDetails] =
    useState<SelectedUserDetails | null>(null);
  const [loggedInUserEmail, setLoggedInUserEmail] = useState<string>('');
  const [organisationName, setOrganisationName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const updateUser = updateUserRoleAction.bind(
    null,
    selectedUserDetails,
    params,
  );
  const [errors, updateUserAction] = useFormState(updateUser, errorState);

  useEffect(() => {
    if (errors.roleError || errors.serviceGroupError) {
      window.scrollTo(0, 0);
    }
    const fetchData = async () => {
      try {
        const userDetails = (await session.get('userDetails')) as UserDetails;
        const organisationDetails = (await session.get(
          'selectedOrganisation',
        )) as Organisation;
        if (userDetails) {
          setLoggedInUserEmail(userDetails['primaryContactEmailAddress']);
          setOrganisationName(organisationDetails.name || 'N/A');
        }
        if (!selectedUserDetails) {
          const details = await getSelectedUserDetails(
            Number(params.identifier),
          );
          if (details) {
            setSelectedUserDetails(details);
            await session.set('changeUserDetails', JSON.stringify(details));
          }
        }
      } catch (err) {
        console.error('Failed to fetch details', err);
      } finally {
        setLoading(false);
      }
    };

    if (!selectedUserDetails) {
      void fetchData();
    }
  }, [params.identifier, selectedUserDetails, errors]);

  const getStatusClassName = (status: string) => {
    switch (status) {
      case 'Enabled':
        return 'govuk-tag govuk-tag--green';
      case 'Pending':
        return 'govuk-tag govuk-tag--yellow';
      case 'Disabled':
        return 'govuk-tag govuk-tag--grey';
      default:
        return 'govuk-tag';
    }
  };

  const renderActionButtons = () => {
    if (selectedUserDetails?.primaryContactEmailAddress === loggedInUserEmail) {
      return null;
    }

    if (selectedUserDetails?.webUserAccountStatusName === 'Disabled') {
      return (
        <Link
          href={`/dashboard/account-management/change-user-details/${params.identifier}/enable-user`}
        >
          <Button
            id="enable-button"
            className="govuk-button govuk-button--secondary single-line-button"
            text="Enable user"
            aria-label="Enable user"
            data-cy="enable-button"
            data-testid="enable-button"
          ></Button>
        </Link>
      );
    }

    if (selectedUserDetails?.webUserAccountStatusName === 'Enabled') {
      return (
        <Link
          href={`/dashboard/account-management/change-user-details/${params.identifier}/disable-user`}
        >
          <Button
            id="disable-button"
            className="govuk-button govuk-button--secondary single-line-button"
            text="Disable user"
            aria-label="Disable user"
            data-cy="disable-button"
            data-testid="disable-button"
          ></Button>
        </Link>
      );
    }

    return null;
  };

  if (loading) {
    return null;
  }

  return (
    <main>
      <GridRow>
        <GridCol className="two-thirds">
          <div id="main-content" className="govuk-!-margin-top-4">
            <BackButton previousPage={'/dashboard/account-management'} />
            {errors.roleError}
            {errors.roleError || errors.serviceGroupError ? (
              <div
                className="govuk-error-summary"
                data-module="govuk-error-summary"
              >
                <div role="alert">
                  <h2 className="govuk-error-summary__title">
                    There is a problem
                  </h2>
                  <div className="govuk-error-summary__body">
                    <ul className="govuk-list govuk-error-summary__list">
                      {errors.roleError ? (
                        <li>
                          <a href="#user-roles">{errors.roleError}</a>
                        </li>
                      ) : null}
                      {errors.serviceGroupError ? (
                        <li>
                          <a href="#service-groups">
                            {errors.serviceGroupError}
                          </a>
                        </li>
                      ) : null}
                    </ul>
                  </div>
                </div>
              </div>
            ) : null}
            <h1 className="govuk-heading-xl">
              Change user roles{' '}
              <span className="govuk-caption-m govuk-!-margin-top-2">
                {organisationName}
              </span>
            </h1>
            <p className="govuk-body">
              Here, you can edit and update user permissions, connect to other
              organisations, or deactivate individual user accounts.
            </p>
            <Details
              id="registration-guidance-id"
              heading="Permission levels explained"
              className=" govuk-!-padding-top-3"
            >
              <div>
                <h4 className="heading-small">Admin role</h4>
                <p className="govuk-body">
                  Admins have access to all services and organisational data
                  within RegulatoryConnect, and act as the Responsible Person
                  representing their organisation. They also have authority to
                  invite new user, and manage or assign roles.
                </p>
                <p className="govuk-body">Admin permissions include:</p>
              </div>
              <div style={{ padding: 0, margin: 0 }}>
                <p className="govuk-body" style={{ marginBottom: '0' }}>
                  1. Access to all areas of RegulatoryConnect portal by default.
                </p>
                <p className="govuk-body" style={{ marginBottom: '0' }}>
                  2. Assign or manage all user roles to service groups by
                  default.
                </p>
                <p className="govuk-body" style={{ marginBottom: '0' }}>
                  3. Access to all organisational data by default.
                </p>
              </div>
              <div>
                <h4 className="heading-small">Manager role</h4>
                <p className="govuk-body">
                  Managers have the same permissions as admins within
                  RegulatoryConnect, except they cannot access the Account
                  management section, or assign or manage user roles.
                </p>
                <p className="govuk-body">Manager permissions include:</p>
              </div>
              <div style={{ padding: 0, margin: 0 }}>
                <p className="govuk-body" style={{ marginBottom: '0' }}>
                  1. Access to all areas of RegulatoryConnect portal except
                  Account management by default.
                </p>
                <p className="govuk-body" style={{ marginBottom: '0' }}>
                  2. Service group assignment by default.
                </p>
                <p className="govuk-body" style={{ marginBottom: '0' }}>
                  3. Access to all organisational data by default.
                </p>
              </div>
              <div>
                <h4 className="heading-small">Contributor role</h4>
                <p className="govuk-body">
                  Contributors are assigned by the admin to a service group
                  where they will have access to all associated services types
                  within the same group.
                </p>
                <p className="govuk-body">Contributor permissions include:</p>
              </div>
              <div style={{ padding: 0, margin: 0 }}>
                <p className="govuk-body" style={{ marginBottom: '0' }}>
                  1. Access to all areas of RegulatoryConnect portal except
                  Account management by default.
                </p>
                <p className="govuk-body" style={{ marginBottom: '0' }}>
                  2. Service group assignment by default.
                </p>
                <p className="govuk-body" style={{ marginBottom: '0' }}>
                  3. Access to all organisational data by default.
                </p>
              </div>
            </Details>

            <table className="govuk-table organisation-details-table">
              <tbody className="govuk-table__body">
                <tr className="govuk-table__row">
                  <th
                    scope="row"
                    className="govuk-table__header organisation-details-header govuk-!-width-one-third"
                  >
                    Current user status
                  </th>
                  <td className="govuk-table__cell">
                    <span
                      className={getStatusClassName(
                        selectedUserDetails?.webUserAccountStatusName || '',
                      )}
                    >
                      {selectedUserDetails?.webUserAccountStatusName}
                    </span>
                  </td>
                </tr>

                <tr className="govuk-table__row">
                  <th
                    scope="row"
                    className="govuk-table__header organisation-details-header govuk-!-width-one-third"
                  >
                    Active from
                  </th>
                  <td className="govuk-table__cell organisation-details-cell">
                    {selectedUserDetails?.roleValidFrom}
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
                    {selectedUserDetails?.webUserName}
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
                    {selectedUserDetails?.primaryContactEmailAddress}
                  </td>
                </tr>
                <tr className="govuk-table__row">
                  <th
                    scope="row"
                    className="govuk-table__header organisation-details-header govuk-!-width-one-third"
                  >
                    Role
                  </th>
                  <td className="govuk-table__cell organisation-details-cell">
                    {selectedUserDetails?.roles.map(role => (
                      <dt key={role.roleName}>{role.roleName}</dt>
                    ))}
                  </td>
                </tr>
                <tr className="govuk-table__row">
                  <th
                    scope="row"
                    className="govuk-table__header organisation-details-header govuk-!-width-one-third"
                  >
                    Service group
                  </th>
                  <td className="govuk-table__cell organisation-details-cell">
                    {selectedUserDetails?.serviceGroups &&
                    selectedUserDetails.serviceGroups.length > 0 ? (
                      selectedUserDetails?.serviceGroups.map(serviceGroup => (
                        <dt key={serviceGroup.roleName}>
                          {serviceGroup.roleName}
                        </dt>
                      ))
                    ) : (
                      <>
                        <dt>Medical Devices</dt>
                        <dt>Medicinal Products</dt>
                        <dt>Supply Chain</dt>
                      </>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
            <form action={updateUserAction}>
              {selectedUserDetails?.primaryContactEmailAddress ===
              loggedInUserEmail ? (
                <div className="govuk-inset-text">
                  You cannot change your own role.
                </div>
              ) : (
                <div className="govuk-grid-row">
                  <UserRoles errors={errors} />
                  <div className="govuk-grid-row">
                    <div className="govuk-grid-column-two-thirds govuk-!-padding-left-0">
                      <div className="govuk-grid-row">
                        <div className="govuk-grid-column-one-half govuk-!-padding-left-0">
                          <Button
                            id="continue-button"
                            text="Save and submit"
                            aria-label="Continue"
                            data-cy="continue-button"
                            data-testid="continue-button"
                            className="govuk-button single-line-button"
                          ></Button>
                        </div>
                        <div>{renderActionButtons()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
          <div className="govuk-grid-row govuk-!-padding-bottom-5">
            <p>
              <Link
                id="help-link"
                className="govuk-link"
                aria-label="Return to Manage user access"
                href={`/dashboard/account-management`}
                rel="noreferrer noopener"
                data-cy="help-link"
                data-testid="help-link"
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
    </main>
  );
}

export default Page;
