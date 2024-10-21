'use server';
import { fetchService } from 'core/services/fetchService';
import { RadioFieldType } from '../../components/Radio';
import { GET_CAM_ORGANISATION_NAME } from 'core/services/endPoints';
import { Answer } from 'core/validation/types';
import { getAuthorizationToken } from 'core/services/apiService';
interface Organisation {
  organisationName: string;
}
type ApiResponse = Organisation[];
type ReturnType = {
  field: RadioFieldType | null;
  count: number;
};

const calculateScore = (input: string, name: string): number => {
  const normalizedInput = input.toLowerCase();
  const normalizedName = name.toLowerCase();
  let score = 0;
  let position = normalizedName.indexOf(normalizedInput);
  while (position !== -1) {
    score += 1 / (position + 1);
    position = normalizedName.indexOf(normalizedInput, position + 1);
  }

  return score;
};

export default async function GetOrganisationNameRadios(
  organisationName: string,
): Promise<ReturnType> {
  try {
    const apiToken = await getAuthorizationToken(GET_CAM_ORGANISATION_NAME);
    const params = `organisationName=${organisationName}`;
    const apiUrl = `${GET_CAM_ORGANISATION_NAME}?${params}`;

    const response = (await fetchService.get(apiUrl, {
      headers: {
        Authorization: apiToken,
        'Content-Type': 'application/json',
      },
    })) as ApiResponse;

    console.log('API response:', response);

    if (!Array.isArray(response) || response.length === 0) {
      return { field: null, count: 0 };
    }

    const results = response
      .map(org => ({
        ...org,
        score: calculateScore(organisationName, org.organisationName),
      }))
      .filter(org => org.score > 0)
      .sort((a, b) => b.score - a.score);

    if (results.length === 0) {
      return { field: null, count: 0 };
    }

    const radioAnswers: Answer[] = results.map(org => ({
      value: org.organisationName,
      label: org.organisationName,
      route: 'onboard-organisation',
    }));

    const field = {
      type: 'radio',
      name: 'organisation name',
      options: radioAnswers.map(answer => answer.value),
      identifier: 'organisation-name-radios',
      id: 'organisation-name-radios',
      answers: radioAnswers,
    } as RadioFieldType;

    return { field, count: results.length };
  } catch (error) {
    console.error('Error fetching organisation names:', error);
    return { field: null, count: 0 };
  }
}
