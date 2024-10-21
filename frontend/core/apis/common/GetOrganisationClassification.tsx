'use server';
import Select, { SelectFieldType } from 'core/components/Select';
import { fetchService } from 'core/services/fetchService';
import { GET_ORGANISATION_CLASSIFICATION } from 'core/services/endPoints';
import { OrganisationClassification } from 'core/models/apiModel';
import { getAuthorizationToken } from 'core/services/apiService';

type Organisation = OrganisationClassification[];

export default async function GetOrganisationClassificationSelect() {
  try {
    const apiUrl = GET_ORGANISATION_CLASSIFICATION;
    const apiToken = await getAuthorizationToken(
      GET_ORGANISATION_CLASSIFICATION,
    );
    const response = (await fetchService.get(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiToken,
      },
    })) as Organisation;

    const options = response.map(({ organisationClassificationName }) => ({
      label: organisationClassificationName,
      value: organisationClassificationName,
    }));

    const field: SelectFieldType = {
      type: 'select',
      identifier: 'organisation-classification',
      answers: options,
    };

    const errorSummary = { title: 'There is a problem', errors: [] };

    return <Select field={field} errorSummary={errorSummary} />;
  } catch (error) {
    console.error('Error fetching organisation classifications:', error);
    return null;
  }
}
