'use client';
import { useEffect, useState } from 'react';
import { GridRow, GridCol } from '@mhra/mhra-design-components';
import Button from 'core/components/Button';
import BackButton from 'core/util/BackButton';
import * as session from '../../../../core/models/redis';
import { organisationDetailsIsFound } from './actions';
import {
  Organisation,
  BillingAccountsType,
  OrganisationDetailsResponse,
} from 'core/models/apiModel';
import SummaryTable from '../../../../core/components/SummaryTable';

// Define types for the object structure
type DetailsObjType = Partial<BillingAccountsType>;

// Helper function to map details using a custom label mapping
const mapDetails = (
  detailsObj: DetailsObjType,
  labelMapping: { [key: string]: string },
) => {
  return Object.keys(labelMapping).map(key => {
    const value = detailsObj[key as keyof DetailsObjType];
    return {
      label: labelMapping[key], // Use custom label from mapping
      value: Array.isArray(value)
        ? value.map(item => item.emailAddress).join(', ')
        : value || '',
    };
  });
};

export default function OrganisationDetails() {
  // State hooks to manage company, contact, and billing details
  const [companyDetails, setCompanyDetails] = useState<
    { label: string; value: string }[]
  >([]);
  const [mhraOrgIdentity, setMhraOrgIdentity] = useState<string>('');
  const [contactDetails, setContactDetails] = useState<
    { label: string; value: string }[]
  >([]);
  const [billingDetails, setBillingDetails] = useState<
    { label: string; value: string }[][]
  >([]);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        // Fetch selected organisation from session
        const selectedOrganisation = (await session.get(
          'selectedOrganisation',
        )) as Organisation;
        if (!selectedOrganisation)
          return console.error('No organisation found in session');

        // Fetch organisation details based on the selected organisation's identifier
        const organisationDetailsResponse = (await organisationDetailsIsFound(
          selectedOrganisation.identifier,
        )) as OrganisationDetailsResponse;

        const {
          organisationCompanyDetails,
          organisationCommunicationContacts,
          organisationBillingDetails,
        } = organisationDetailsResponse;

        // Define custom labels for company details
        const companyLabelMapping = {
          organisationTypeName: 'Legal status',
          organisationRegistrationNo: 'Company registration number',
          organisationName: 'Company name',
          addressLine1: 'Address line 1',
          addressLine2: 'Address line 2',
          addressLine3: 'Address line 3',
          addressLine4: 'Address line 4',
          city: 'Town or city',
          postalcode: 'Postcode',
          country: 'Country',
        };

        if (organisationCompanyDetails) {
          const details = mapDetails(
            organisationCompanyDetails[0],
            companyLabelMapping,
          );
          setCompanyDetails(details);
          setMhraOrgIdentity(
            organisationCompanyDetails[0]?.mhraOrgIdentity || '',
          );
        }

        // Sort to ensure primary contact comes first
        if (organisationCommunicationContacts?.length) {
          const contacts = organisationCommunicationContacts
            .sort(a =>
              a.organisationEmailTypeName === 'Primary contact' ? -1 : 1,
            )
            .map(contact => ({
              label:
                contact.organisationEmailTypeName === 'Contact'
                  ? 'Secondary contact'
                  : contact.organisationEmailTypeName || '',
              value: contact.organisationEmailAddress || '',
            }));
          setContactDetails(contacts);
        } else {
          setContactDetails([
            { label: 'No contact information available', value: '' },
          ]);
        }

        // Define custom labels for billing details
        const billingLabelMapping = {
          addressLine1: 'Address line 1',
          addressLine2: 'Address line 2',
          addressLine3: 'Address line 3',
          addressLine4: 'Address line 4',
          city: 'Town or city',
          addressState: 'County',
          postalcode: 'Postcode',
          country: 'Country',
        };

        // Map billing details using custom labels, if available, otherwise set a default message
        if (organisationBillingDetails?.length) {
          const billing = organisationBillingDetails.map(
            (contact: BillingAccountsType) => [
              ...mapDetails(contact, billingLabelMapping),
              ...contact.contactDetails.map(details => ({
                label: details.organisationEmailTypeName || '',
                value: details.emailAddress || '',
              })),
            ],
          );
          setBillingDetails(billing);
        } else {
          setBillingDetails([
            [{ label: 'No billing information available', value: '' }],
          ]);
        }
      } catch (error) {
        console.error('Error fetching company details:', error);
      }
    };

    void fetchCompanyDetails();
  }, []);

  return (
    <GridRow>
      <GridCol className="full">
        <BackButton previousPage={'/dashboard/account-management'} />
        <h1 className="govuk-heading-xl">
          Organisation details{' '}
          <span className="govuk-caption-m">
            MHRA Company Number: {mhraOrgIdentity}
          </span>
        </h1>
      </GridCol>

      <GridCol className="full">
        <h2 className="govuk-heading-l">Company information</h2>
      </GridCol>

      <SummaryTable title="Company address" details={companyDetails} />

      <SummaryTable title="Communication contacts" details={contactDetails} />

      <SummaryTable title="Billing accounts" details={billingDetails.flat()} />

      <GridCol className="full">
        <div className="govuk-!-padding-top-4">
          <Button
            text={'Update organisation details'}
            className={'govuk-button govuk-button--secondary'}
          />
        </div>
        <p className="govuk-!-padding-top-5">
          <a
            href="/report-a-problem"
            className="govuk-link"
            rel="noreferrer noopener"
            target="_blank"
          >
            Report a problem with this page (opens in new tab)
          </a>
        </p>
      </GridCol>
    </GridRow>
  );
}
