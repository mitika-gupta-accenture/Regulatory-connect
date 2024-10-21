import * as session from 'core/models/redis';

export type OrganisationCompanyDetailsType = {
  organisationName: string;
  mhraOrgIdentity: string;
  organisationRegistrationNo: string;
  organisationTypeName: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  addressLine4: string;
  city: string;
  addressState: string;
  postalcode: string;
  country: string;
};

export type CommunicationContactsType = {
  organisationEmailTypeName: string;
  organisationEmailAddress: string;
};

export type BillingAccountsType = {
  country: string;
  contactDetails: { organisationEmailTypeName: string; emailAddress: string }[];
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  addressLine4: string;
  city: string;
  addressState: string;
  postalcode: string;
  emailAddress: string;
};

export type OrganisationDetailsResponse = {
  organisationCompanyDetails: OrganisationCompanyDetailsType[];
  organisationCommunicationContacts: CommunicationContactsType[];
  organisationBillingDetails: BillingAccountsType[];
};

export type OrganisationClassification = {
  organisationClassificationTypeIdentifier: number;
  organisationClassificationName: string;
  validFrom: string;
  validTo: string | null;
};

export type OrganisationType = {
  organisationTypeIdentifier: number;
  organisationTypeName: string;
  validFrom: string;
  validTo: string | null;
};

export interface AnswerType {
  answer: string;
  identifier: string;
  code: string;
}

export type MicrosoftUserDetails = {
  firstName: string;
  lastName: string;
  email: string;
  personIdentifier: number;
  mhraOrganisationIdentifier: number;
  organisationIdentifier: number;
  companyName: string;
};

export interface RefApiResponseType {
  [key: string]: any;
}

export interface AppTerritoryRefType {
  identifier: number;
  code: number;
  name: string;
  isActive: string;
}

export type Organisation = {
  identifier: number;
  name: string;
  webUserAccountRoleName: string;
  mhraOrgIdentity: string;
  roleValidTo: string | null;
};

export type UserRole = {
  roleId: string;
  roleName: number;
};
export type Role = {
  label: string;
  value: number;
};

export type RolesAndServiceGroups = {
  roles: Role[];
  serviceGroups: Role[];
};

export type UserDetails = {
  personIdentifier: number;
  webUserName: string;
  primaryContactEmailAddress: string;
  webUserAccountStatusName: string;
  organisations: Organisation[];
};

export type SelectedUserDetails = {
  webUserAccountRoleName: string;
  primaryContactEmailAddress: string;
  webUserAccountStatusName: string;
  roleValidFrom: string;
  roleValidTo: string;
  webUserName: string;
  organisationName: string;
  organisationIdentifier: number;
  roles: UserRole[];
  serviceGroups: UserRole[];
};

export type OrgUser = {
  personIdentifier: string;
  primaryContactEmailAddress: string;
  webUserAccountRoleName: string;
  webUserAccountStatusName: string;
};

export interface selectedOrganisationDetails {
  identifier: number;
  name: string;
  webUserAccountRoleName: string;
  mhraOrgIdentity: string;
}

export interface oldUserDetails {
  personIdentifier: number;
  primaryContactEmailAddress: string;
  webUserAccountRoleName: string;
  webUserAccountStatusName: string;
  selectedOrganisation: selectedOrganisationDetails;
}

export type DataBodyType = AnswerType[];
//The USER_DETAILS_KEYS is constant across all the flows
const USER_DETAILS_KEYS = [
  'personIdentifier',
  'mhraOrganisationIdentifier',
  'organisationIdentifier',
] as const;
type UserDetailsKeys = (typeof USER_DETAILS_KEYS)[number];
// A new object Array to be added in the below requestBodyObjects for every POST request Body
const requestBodyObjects: { [key: string]: string[] } = {
  POST_PL_NUMBER_GENERATION: [
    'applicationTypeIdentifier',
    'territoryIdentifier',
    'count',
  ],
  POST_PL_GENERATE_DOSSIER_ID: ['dossierTypeIdentifier'],
};

export async function getFlowSpecificRequestBody(
  apiGroupName: string,
  data: DataBodyType,
): Promise<Record<string, number>> {
  const flowSpecificRequestBody: Record<string, number> = {};
  const flowSpecificRequestBodyValues = requestBodyObjects[apiGroupName];

  // Use for...of to handle async/await properly
  for (const id of flowSpecificRequestBodyValues) {
    const matchedData = data.find(item => item.identifier === id);
    let territoryData;
    switch (apiGroupName) {
      case 'POST_PL_NUMBER_GENERATION':
        const apiData = (await session.get(
          'refData_GET_PL_NUMBER_GENERATION',
        )) as RefApiResponseType;
        if (matchedData) {
          apiData['territory'].forEach((obj: AppTerritoryRefType) => {
            if (String(obj.code) === '251') {
              territoryData = String(obj.identifier);
            }
          });
          if (matchedData?.code === '2') {
            if (territoryData) {
              flowSpecificRequestBody['territoryIdentifier'] = parseInt(
                territoryData,
                10,
              );
            }
          }
          flowSpecificRequestBody[id] = parseInt(matchedData.answer, 10);
        }
        break;
      default:
        if (matchedData) {
          flowSpecificRequestBody[id] = parseInt(matchedData.answer, 10);
        }
        break;
    }
  }
  return flowSpecificRequestBody;
}
export function getUserDetailsRequestBody(
  userSessionData: oldUserDetails,
  apiGroupName: string,
): Record<UserDetailsKeys, number> {
  const requestBody: Record<UserDetailsKeys, number> = {} as Record<
    UserDetailsKeys,
    number
  >;

  switch (apiGroupName) {
    case 'POST_PL_GENERATE_DOSSIER_ID':
      requestBody.personIdentifier = userSessionData?.personIdentifier;
      requestBody.organisationIdentifier =
        userSessionData?.selectedOrganisation?.identifier;
      break;
    default:
      requestBody.personIdentifier = userSessionData?.personIdentifier;
      requestBody.mhraOrganisationIdentifier = parseInt(
        userSessionData?.selectedOrganisation?.mhraOrgIdentity,
      );
      requestBody.organisationIdentifier =
        userSessionData?.selectedOrganisation?.identifier;
      break;
  }
  return requestBody;
}

export async function createRequestBody(
  data: DataBodyType,
  apiGroupName: string,
  userSessionData: oldUserDetails,
) {
  return {
    ...(await getFlowSpecificRequestBody(apiGroupName, data)),
    ...getUserDetailsRequestBody(userSessionData, apiGroupName),
  };
}
