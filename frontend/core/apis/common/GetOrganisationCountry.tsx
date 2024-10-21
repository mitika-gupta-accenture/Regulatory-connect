'use server';
import Select, { SelectFieldType } from 'core/components/Select';
import { fetchService } from 'core/services/fetchService';
import { GET_COUNTRY } from 'core/services/endPoints';
import { getAuthorizationToken } from 'core/services/apiService';

type Country = {
  identifier: number;
  code: number;
  name: string;
  isActive: string;
};

type CountryResponse = {
  total: number;
  skip: number;
  limit: number;
  data: {
    country: Country[];
  };
};

export default async function GetOrganisationCountrySelect() {
  try {
    const apiUrl = GET_COUNTRY;
    const apiToken = await getAuthorizationToken(GET_COUNTRY);
    const response = (await fetchService.get(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiToken,
      },
    })) as CountryResponse;

    const options = response.data.country.map(({ name }) => ({
      label: name,
      value: name,
    }));

    const field: SelectFieldType = {
      type: 'select',
      identifier: 'organisation-country',
      answers: options,
    };

    const errorSummary = { title: 'There is a problem', errors: [] };

    return (
      <>
        <h1 className="govuk-label">Country</h1>
        <Select field={field} errorSummary={errorSummary} />
      </>
    );
  } catch (error) {
    console.error('Error fetching organisation countries:', error);
    return null;
  }
}
