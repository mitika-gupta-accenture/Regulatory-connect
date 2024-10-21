'use client';
import Link from 'next/link';
import { GridWrapper } from '@mhra/mhra-design-components';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import { SelectedUserDetails } from 'core/models/apiModel';
import { getSelectedUserDetails } from 'core/apis/cam/GetSelectedUserDetails';

function Page({ params }: { params: { identifier: string } }) {
  const [selectedUserDetails, setSelectedUserDetails] =
    useState<SelectedUserDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!selectedUserDetails) {
          const details = await getSelectedUserDetails(
            Number(params.identifier),
          );
          if (details) {
            setSelectedUserDetails(details);
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
  }, [params.identifier, selectedUserDetails]);

  if (loading) {
    return null;
  }
  return (
    <GridWrapper>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <div id="main-content" className="govuk-!-margin-top-4">
            <div className="govuk-panel govuk-panel--confirmation">
              <h1 className="govuk-panel__title">Request submitted</h1>
            </div>
            <p className="govuk-body-l govuk-!-padding-top-7">
              Your request has been submitted.
            </p>
            <table className="govuk-table organisation-details-table">
              <tbody className="govuk-table__body">
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
                    Organisation
                  </th>
                  <td className="govuk-table__cell organisation-details-cell">
                    {selectedUserDetails?.organisationName}
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
            <p className="govuk-body">
              <Link
                id="onboarding-guidance-link"
                className="govuk-link"
                aria-label="Onboarding guidance page"
                href="/dashboard/account-management"
                data-cy="onboarding-guidance-link"
                data-testid="onboarding-guidance-link"
              >
                Return to Manage user access
              </Link>
            </p>
            <div className="govuk-grid-row govuk-!-padding-top-5 govuk-!-padding-bottom-5">
              <p>
                <Link
                  id="website-survey-link"
                  className="govuk-link"
                  aria-label="What did you think of this service?"
                  href="/contactmhra"
                  rel="noreferrer noopener"
                  data-cy="website-survey-link"
                  target="_blank"
                  data-testid="website-survey-link"
                >
                  What did you think of this service? (takes 30 seconds)
                </Link>
              </p>
            </div>
            <div className="govuk-grid-row govuk-!-padding-bottom-5">
              <p>
                <Link
                  id="new-tab-link"
                  className="govuk-link"
                  aria-label="Report a problem with this page (opens in new tab)"
                  href="/contactmhra"
                  rel="noreferrer noopener"
                  target="_blank"
                  data-testid="new-tab-link"
                >
                  Report a problem with this page (opens in new tab)
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </GridWrapper>
  );
}
export default Page;
