'use client';

import { Button, GridCol, GridRow } from '@mhra/mhra-design-components';
import { createNewUserAndAssign } from '../actions';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import BackButton from 'core/util/BackButton';
import { Organisation } from 'core/models/apiModel';
import * as session from '../../../../../core/models/redis';
import { NewUserDetails } from '../page';

const permissionDictionary = {
  '1': 'Admin',
  '2': 'Regulatory Manager',
  '3': 'Regulatory Contributor',
};

const ActionButtons = () => {
  return (
    <div className="govuk-button-group">
      <Button
        onClick={async () => {
          await createNewUserAndAssign();
        }}
        name="continue-button"
        disabled={false}
        text={'Confirm and submit'}
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
  const [newUserDetails, setNewUserDetails] = useState({} as NewUserDetails);
  const [selectedOrganisation, setSelectedOrganisation] = useState(
    {} as Organisation,
  );

  useEffect(() => {
    const getOrgDetails = async () => {
      const inputUserDetails = (await session.get(
        'newUserDetails',
      )) as NewUserDetails;
      const currentOrganisation = (await session.get(
        'selectedOrganisation',
      )) as Organisation;

      setNewUserDetails(inputUserDetails);
      setSelectedOrganisation(currentOrganisation);
    };

    void getOrgDetails();
  }, []);

  return (
    <main className="govuk-main-wrapper">
      <GridRow>
        <GridCol className="two-thirds">
          <BackButton previousPage={''} />
          <h1 className="govuk-heading-xl govuk-!-margin-top-4 govuk-!-margin-bottom-5">
            Confirm user details
          </h1>
          <dl className="govuk-summary-list">
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Permission role</dt>
              <dd className="govuk-summary-list__value">
                {permissionDictionary[newUserDetails.permission]}
              </dd>
              <dd className="govuk-summary-list__actions">
                <a
                  className="govuk-link"
                  href="/dashboard/account-management/add-new-user"
                >
                  Change
                  <span className="govuk-visually-hidden">Permission role</span>
                </a>
              </dd>
            </div>
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">User name</dt>
              <dd className="govuk-summary-list__value">
                {newUserDetails.firstName} {newUserDetails.lastName}
              </dd>
              <dd className="govuk-summary-list__actions">
                <a
                  className="govuk-link"
                  href="/dashboard/account-management/add-new-user"
                >
                  Change
                  <span className="govuk-visually-hidden"> User name</span>
                </a>
              </dd>
            </div>
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Email</dt>
              <dd className="govuk-summary-list__value">
                {newUserDetails.email}
              </dd>
              <dd className="govuk-summary-list__actions">
                <a
                  className="govuk-link"
                  href="/dashboard/account-management/add-new-user"
                >
                  Change<span className="govuk-visually-hidden"> Email</span>
                </a>
              </dd>
            </div>
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">
                Associated organisation
              </dt>
              <dd className="govuk-summary-list__value">
                {selectedOrganisation.name}
              </dd>
            </div>
          </dl>
          <p className="govuk-body">
            You must confirm the user's information is correct.
          </p>
          {newUserDetails && <ActionButtons />}
        </GridCol>
      </GridRow>
    </main>
  );
}
