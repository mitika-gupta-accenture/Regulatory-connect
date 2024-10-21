'use server';
import { fetchService } from 'core/services/fetchService';
import { RadioFieldType } from '../../components/Radio';
import { GET_ORGANISATION_TYPE } from 'core/services/endPoints';
import { Answer } from 'core/validation/types';
import FieldFactory from 'core/components/FieldFactory';
import { OrganisationType } from 'core/models/apiModel';
import { getAuthorizationToken } from 'core/services/apiService';

type Organisation = OrganisationType[];

export default async function GetOrganisationTypeRadios() {
  try {
    const apiUrl = GET_ORGANISATION_TYPE;
    const apiToken = await getAuthorizationToken(GET_ORGANISATION_TYPE);
    const response = (await fetchService.get(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiToken,
      },
    })) as Organisation;

    const radioAnswers: Answer[] = response.map(org => ({
      value: org.organisationTypeName,
      label: org.organisationTypeName,
      route: 'onboard-organisation',
    }));

    const field = {
      type: 'radio',
      name: 'organisation type',
      options: radioAnswers.map(answer => answer.value),
      identifier: 'organisation-type-radios',
      answers: radioAnswers,
    } as RadioFieldType;

    const errorSummary = { title: 'There is a problem', errors: [] };

    return (
      <>
        <h1 className="govuk-body" style={{ fontWeight: 'bold' }}>
          What is your organisation's legal status?
        </h1>
        <FieldFactory field={field} errorSummary={errorSummary} />
        <br />
      </>
    );
  } catch (error) {
    console.error('Error fetching organisation types:', error);
    return null;
  }
}
