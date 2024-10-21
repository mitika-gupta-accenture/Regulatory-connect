import { FetchOptions, fetchService } from 'core/services/fetchService';
import * as session from 'core/models/redis';
import { redirect } from 'next/navigation';
import { QuestionAnswer } from 'core/validation/types';
import { CAM_BASE_URL } from 'core/services/endPoints';
import ServerSidePagination from 'core/components/ServerSidePagination';

type OrgSearchType = 'company-registration-number' | 'name';
type OrgSearchParams = {
  searchType: OrgSearchType | null;
  value: string;
  page?: number;
};

export type CompaniesHouseCompany = {
  companyName: string;
  companyNumber: string;
  companyStatus: string;
  companyStatusDetail: string;
  registeredOfficeAddress: {
    addressLine1: string;
    addressLine2: string;
    careOf: string;
    country: string;
    locality: string;
    poBox: string;
    postalCode: string;
    premises: string;
    region: string;
  };
};

type OrgSearchApiResponse = {
  organisations: Array<CompaniesHouseCompany>;
  totalCount: number;
};

export default async function SelectYourOrganisation({
  searchParams,
  identifier,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
  identifier: string;
}) {
  const orgSearchAnswer = await session.getAnswer<QuestionAnswer>(
    'organisation-search',
  );
  const searchTypes: {
    [key: string]: { type: OrgSearchType; valueKey: string };
  } = {
    'Company registration number': {
      type: 'company-registration-number',
      valueKey: 'organisation-search-registration-number',
    },
    'Organisation name': {
      type: 'name',
      valueKey: 'organisation-search-organisation-name',
    },
  };
  const radioAnswer = orgSearchAnswer?.answers?.find(
    a => a.identifier === 'organisation-search-radios',
  );
  const searchTypeStr = (radioAnswer?.answer as string) ?? '';
  const searchType = searchTypes[searchTypeStr];
  const pageParam =
    searchParams && 'page' in searchParams && searchParams['page']
      ? (searchParams['page'] as string)
      : undefined;
  const maybeNaNPage = Number(pageParam);
  const page = isNaN(maybeNaNPage) ? 1 : maybeNaNPage;

  if (!searchType) {
    redirect('/');
  }

  const value = orgSearchAnswer?.answers?.find(
    a => a.identifier === searchType?.valueKey,
  )?.answer as string;

  const orgSearchParams: OrgSearchParams = {
    searchType: searchType?.type,
    value: value ?? '',
  };

  if (!isNaN(page)) {
    orgSearchParams.page = page;
  }

  const fetchOptions: FetchOptions = {
    params: orgSearchParams,
  };

  const data = (await fetchService.get(
    'organisationSearch',
    fetchOptions,
    CAM_BASE_URL,
  )) as OrgSearchApiResponse;

  const totalPages = Math.ceil(data.totalCount / 12);

  return (
    <>
      <div className="govuk-form-group">
        <fieldset className="govuk-fieldset">
          <div className="govuk-radios" data-module="govuk-radios">
            {data.organisations.map(o => (
              <div className="govuk-radios__item" key={o.companyNumber}>
                <input
                  className="govuk-radios__input"
                  id={`org-select-${o.companyNumber}`}
                  name={identifier}
                  value={JSON.stringify(o)}
                  type="radio"
                  aria-describedby={`org-select-${o.companyNumber}-hint`}
                />
                <label
                  className="govuk-label govuk-radios__label"
                  htmlFor={`org-select-${o.companyNumber}`}
                >
                  {o.companyName}
                </label>
                <div
                  id={`org-select-${o.companyNumber}-hint`}
                  className="govuk-hint govuk-radios__hint"
                >
                  {o.companyNumber} - {o.companyStatus}
                  <br />
                  {o.registeredOfficeAddress?.addressLine1},{' '}
                  {o.registeredOfficeAddress?.locality},{' '}
                  {o.registeredOfficeAddress?.postalCode},{' '}
                  {o.registeredOfficeAddress?.country}
                </div>
              </div>
            ))}
          </div>
        </fieldset>
      </div>
      {totalPages > 1 && !isNaN(page) && (
        <ServerSidePagination
          currentPage={page}
          totalPages={totalPages}
          basePageHref="?page="
        />
      )}
    </>
  );
}
