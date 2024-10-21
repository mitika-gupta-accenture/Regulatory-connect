'use client';

import { ReactNode, useEffect, useState } from 'react';
import { Details, GridCol, GridRow } from '@mhra/mhra-design-components';
import BackButton from 'core/util/BackButton';
import * as session from '../../../../core/models/redis';
import { Organisation } from 'core/models/apiModel';

interface AppProps {
  children: ReactNode;
}

function App({ children }: AppProps) {
  const [currentOrganisation, setCurrentOrganisation] = useState(
    {} as Organisation,
  );

  useEffect(() => {
    const getOrgDetails = async () => {
      const selectedOrganisation = (await session.get(
        'selectedOrganisation',
      )) as Organisation;
      setCurrentOrganisation(selectedOrganisation);
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
          {children}
          {/* <RedirectByUser isPage={false} /> */}
        </GridCol>
      </GridRow>
    </main>
  );
}

export default App;
