'use client';

import {
  Button,
  Details,
  GridCol,
  GridRow,
} from '@mhra/mhra-design-components';
import { saveNewUserDetails } from './actions';
import Link from 'next/link';
import { useFormState } from 'react-dom';
import { useEffect, useState } from 'react';
import BackButton from 'core/util/BackButton';
import { Organisation } from 'core/models/apiModel';
import * as session from '../../../../core/models/redis';
import { ValidateReturnType } from 'core/util/validateFormData';

const permissionDictionary = {
  '1': 'Admin',
  '2': 'Regulatory Manager',
  '3': 'Regulatory Contributor',
};

export type NewUserDetails = {
  email: string;
  firstName: string;
  lastName: string;
  permission: '1' | '2' | '3';
  organisationIdentifier: string;
};

const initialFormState = [] as ValidateReturnType[];

const ActionButtons = () => {
  return (
    <div className="govuk-button-group">
      <Button
        name="continue-button"
        disabled={false}
        text={'Submit'}
        type="submit"
      />
      <Link
        href="/dashboard/account-management"
        id={'govuk-button-group-child'}
      >
        <Button text={'Cancel'} buttonType="secondary" type="button" />
      </Link>
    </div>
  );
};

export default function Page() {
  const [actionReturn, formAction] = useFormState(
    saveNewUserDetails,
    initialFormState,
  );
  const [currentOrganisation, setCurrentOrganisation] = useState(
    {} as Organisation,
  );

  const [newUserDetails, setNewUserDetails] = useState({} as NewUserDetails);

  const getErrorMessage = (field: string) => {
    return actionReturn
      .filter(error => error.key === field.toLowerCase())
      .map(error => error.message);
  };

  useEffect(() => {
    const getOrgDetails = async () => {
      const selectedOrganisation = (await session.get(
        'selectedOrganisation',
      )) as Organisation;

      const savedUserDetails = (await session.get(
        'newUserDetails',
      )) as NewUserDetails;

      setCurrentOrganisation(selectedOrganisation);
      setNewUserDetails(savedUserDetails);
    };

    void getOrgDetails();
  }, []);

  return (
    <main className="govuk-main-wrapper">
      <GridRow>
        <GridCol className="two-thirds">
          <BackButton previousPage={''} />
          <h1 className="govuk-heading-xl govuk-!-margin-top-4 govuk-!-margin-bottom-1">
            Add a new user
          </h1>
          <span className="govuk-caption-m govuk-!-margin-bottom-5">
            {currentOrganisation.name}
          </span>
          <p className="govuk-body">
            You can invite a new user to register for RegulatoryConnect by
            providing their email address.
          </p>
          <Details
            id="adding-new-email-guidance"
            heading="About adding a new email address"
            className=" govuk-!-padding-top-3"
          >
            <p className="govuk-body">
              New users will be required to sign in to RegulatoryConnect using
              the Microsoft account connected to their email address.
            </p>
            <p className="govuk-body">
              If they do not currently have a Microsoft account, one will be
              created as part of the registration process.
            </p>
            <p className="govuk-body">
              If you would prefer to add a generic or group email address, check
              with your IT administrator that they will be able to sign in to
              the Microsoft account for the email address you want to add.
            </p>
          </Details>
          <form action={formAction}>
            <p className="govuk-body">
              Add the new user's name and email address below, along with their
              assigner permission level and/or service group area.
            </p>

            <div
              className={`govuk-form-group ${!!getErrorMessage('first name').length && 'govuk-form-group--error'}`}
            >
              <h1 className="govuk-label-wrapper">
                <label className="govuk-label" htmlFor="first-name">
                  First name
                </label>
              </h1>
              {!!getErrorMessage('first name').length && (
                <p id="first-name-error" className="govuk-error-message">
                  <span className="govuk-visually-hidden">Error:</span>{' '}
                  {getErrorMessage('first name')}
                </p>
              )}
              <input
                className="govuk-input govuk-!-width-three-quarters"
                id="first-name"
                name="firstName"
                type="text"
                defaultValue={newUserDetails && newUserDetails.firstName}
              />
            </div>

            <div
              className={`govuk-form-group ${!!getErrorMessage('last name').length && 'govuk-form-group--error'}`}
            >
              <h1 className="govuk-label-wrapper">
                <label className="govuk-label" htmlFor="last-name">
                  Last name
                </label>
              </h1>
              {!!getErrorMessage('last name').length && (
                <p id="last-name-error" className="govuk-error-message">
                  <span className="govuk-visually-hidden">Error:</span>{' '}
                  {getErrorMessage('last name')}
                </p>
              )}
              <input
                className="govuk-input govuk-!-width-three-quarters"
                id="last-name"
                name="lastName"
                type="text"
                defaultValue={newUserDetails && newUserDetails.lastName}
              />
            </div>
            <div
              className={`govuk-form-group ${!!getErrorMessage('email').length && 'govuk-form-group--error'}`}
            >
              <h1 className="govuk-label-wrapper">
                <label className="govuk-label" htmlFor="email">
                  Email
                </label>
              </h1>
              {!!getErrorMessage('email').length && (
                <p id="email-error" className="govuk-error-message">
                  <span className="govuk-visually-hidden">Error:</span>{' '}
                  {getErrorMessage('email')}
                </p>
              )}
              <input
                className="govuk-input govuk-!-width-three-quarters"
                id="email"
                name="email"
                type="text"
                defaultValue={newUserDetails && newUserDetails.email}
              />
            </div>

            <div className="govuk-form-group">
              <h1 className="govuk-heading-l">Assign user role</h1>
              <label className="govuk-label" htmlFor="permissions">
                User permission
              </label>

              <select
                className="govuk-select"
                id="permissions"
                name="permissions"
                defaultValue={
                  newUserDetails
                    ? permissionDictionary[newUserDetails.permission]
                    : 'Contributor'
                }
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

            <ActionButtons />
          </form>
          {/* <RedirectByUser isPage={false} /> */}
        </GridCol>
      </GridRow>
    </main>
  );
}
