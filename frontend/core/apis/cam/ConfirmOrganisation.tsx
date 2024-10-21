import * as session from 'core/models/redis';
import { QuestionAnswer } from 'core/validation/types';
import { CompaniesHouseCompany } from './SelectYourOrganisation';

export default async function ConfirmOrganisation() {
  const selectedOrg = await session.get<QuestionAnswer>(
    'select-your-organisation',
  );
  const orgDetails = JSON.parse(
    selectedOrg?.answers.find(a => a.identifier === 'select-organisation')
      ?.answer as string,
  ) as CompaniesHouseCompany;

  return (
    <dl className="govuk-summary-list">
      <div className="govuk-summary-list__row">
        <dt className="govuk-summary-list__key">Organisation name</dt>
        <dd className="govuk-summary-list__value">{orgDetails.companyName}</dd>
      </div>
      <div className="govuk-summary-list__row">
        <dt className="govuk-summary-list__key">Address</dt>
        <dd className="govuk-summary-list__value">
          <p className="govuk-body">
            {orgDetails.registeredOfficeAddress.addressLine1}
          </p>
          <p className="govuk-body">
            {orgDetails.registeredOfficeAddress.addressLine2}
          </p>
          <p className="govuk-body">
            {orgDetails.registeredOfficeAddress.locality}
          </p>
          <p className="govuk-body">
            {orgDetails.registeredOfficeAddress.region}
          </p>
          <p className="govuk-body">
            {orgDetails.registeredOfficeAddress.postalCode}
          </p>
        </dd>
      </div>
      <div className="govuk-summary-list__row">
        <dt className="govuk-summary-list__key">Company number</dt>
        <dd className="govuk-summary-list__value">
          {orgDetails.companyNumber}
        </dd>
      </div>
    </dl>
  );
}
