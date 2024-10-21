// ENDPOINTS
// Format should be <<TYPE OF METHOD>>_<<SERVICE NAME>>_<<USER_FLOW>>

//MOCKI.IO
export const commonBaseUrl = 'https://mocki.io/v1/';
/*--------------------------------------------------------------------------------------------------------------------------------------*/

// CUSTOMER ACCOUNT MANAGEMENT (CAM)
// BASE URL & KEY
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const CAM_BASE_URL = `${API_BASE_URL}cam/v1/`;
export const CAM_BASE_REF_URL = `${API_BASE_URL}reference/common/v1/`;
// GET ENDPOINTS (CAM)
export const GET_CAM_USER_STATUS_AND_ROLE: string =
  CAM_BASE_URL + 'userStatusAndRole';
export const GET_CAM_ORGANISATIONS_USERS: string =
  CAM_BASE_URL + 'getAllOrganisationUsers';
export const GET_CAM_ROLES_SERVICE_GROUPS: string =
  CAM_BASE_URL + 'rolesAndServiceGroups';
export const GET_CAM_ORGANISATION_DETAILS: string =
  CAM_BASE_URL + 'organisationDetails';
export const GET_CAM_SELECTED_USER_DETAILS: string =
  CAM_BASE_URL + 'getSelectedUserDetails';
export const GET_CAM_ORGANISATION_NAME: string =
  CAM_BASE_URL + 'organisationName';
export const GET_ORGANISATION_TYPE: string =
  CAM_BASE_REF_URL + 'organisationType';
export const GET_ORGANISATION_CLASSIFICATION: string =
  CAM_BASE_REF_URL + 'organisationClassificationType';
export const GET_COUNTRY: string =
  CAM_BASE_REF_URL + 'countries?limit=300&skip=0&sortField=name&sortOrder=asc';
export const GET_CAM_USER_PERMISSIONS: string =
  CAM_BASE_URL + 'userPermissions';
// POST ENDPOINTS (CAM)
export const POST_CAM_CREATE_USER: string = CAM_BASE_URL + 'createUser';
export const POST_CAM_CHANGE_USER_STATUS: string =
  CAM_BASE_URL + 'updateUserRoleValidFrom';
export const POST_CAM_UPDATE_USER_ROLES: string =
  CAM_BASE_URL + 'updateUserRoles';
export const POST_CAM_CREATE_WEB_USER_ACCOUNT_ROLE_AND_ORGANISATION_PERSON_ROLE: string =
  CAM_BASE_URL + 'createUserOrganisationRole';

/*--------------------------------------------------------------------------------------------------------------------------------------*/

//PL
//BASE URL & KEY
// GET ENDPOINTS
const PL_LICENSE_NUMBER_GENERATION_PRODUCT_CLASS: string =
  'reference/common/v1/applicationtype';
const PL_LICENSE_NUMBER_GENERATION_TERRITORY: string =
  'reference/common/v1/territory?sortField=name&sortOrder=asc';
// POST ENDPOINTS
const PL_LICENCE_NUMBER_GENERATE_PL_NUMBERS: string =
  'pl/v1/submission/mhrariIds';

//CMS
export const CMS_BASE_URL = 'CMS/api/v1/';
// GET ENDPOINTS
const CMS_CHOOSE_SUBMISSION_TYPE: string =
  CMS_BASE_URL + 'choose-submission-type';

//TYA
//GET ENDPOINTS
const PL_TYA_ACCESS_PARTNER: string = 'exp/refdata/common/accesspartner';
const PL_TYA_ORBIS_PARTNER: string = 'exp/refdata/common/orbispartner';
const PL_TYA_REFERENCE_REGULATOR: string =
  'exp/refdata/common/referenceregulator';
const PL_TYA_PRODUCT_CLASS_TYPES: string =
  'medicinalproduct/v1/refdata/mp/productclasstypes';
const PL_TYA_TRADING_NAME_ORGANISATION: string =
  'exp/refdata/cam/tradingnameorg?organisationId=1224';
const PL_TYA_ORGANISATION_ADDRESS: string =
  'exp/masterdata/cam/organisation/address?orgIdentifier=1214,1232';
const PL_TYA_TERRITORY: string = 'exp/refdata/common/territory';
const PL_TYA_TRADING_NAME: string =
  'exp/refdata/cam/tradingnameorg?organisationId=1215';
const PL_TYA_RECLASSIFICATION_STATUS: string = 'pl/v1/reclassificationstatus/';

//Dossier ID
//GET ENDPOINTS
const PL_DOSSIER_TYPE: string = 'pl/v1/refdata/common/dossiertype';

//POST ENDPOINTS
const PL_GENERATE_DOSSIER_ID: string = 'pl/v1/submission/dossierid';
/*--------------------------------------------------------------------------------------------------------------------------------------*/

/*====================================================================================================================================*/
// GROUPS
// Format should be <<SUBMISSION TYPE>>_<<JOURNEY>>_<<PAGE(if needed)>>
// For CMS API endpoint groups: CMS_<<JOURNEY>>_<<PAGE(if needed)>>

//CMS GROUP
const CMS_GET_CHOOSE_SUBMISSION_TYPE: string[] = [CMS_CHOOSE_SUBMISSION_TYPE];

//PL GROUPS
const GET_PL_NUMBER_GENERATION: string[] = [
  PL_LICENSE_NUMBER_GENERATION_PRODUCT_CLASS,
  PL_LICENSE_NUMBER_GENERATION_TERRITORY,
];
const POST_PL_NUMBER_GENERATION: string[] = [
  PL_LICENCE_NUMBER_GENERATE_PL_NUMBERS,
];

//TYA GROUP
const GET_PL_TYA: string[] = [
  PL_TYA_ACCESS_PARTNER,
  PL_TYA_ORBIS_PARTNER,
  PL_TYA_REFERENCE_REGULATOR,
  PL_TYA_TRADING_NAME_ORGANISATION,
  PL_TYA_ORGANISATION_ADDRESS,
  PL_TYA_TERRITORY,
  PL_TYA_TRADING_NAME,
];

//PL_TYA_RECLASSIFICATION_STATUS
const GET_PL_TYA_RECLASSIFICATION: string[] = [PL_TYA_RECLASSIFICATION_STATUS];
// TYA Product class type
const GET_PL_PRODUCT_CLASS_TYPES: string[] = [PL_TYA_PRODUCT_CLASS_TYPES];
const GET_PL_TYA_TERRITORY: string[] = [PL_LICENSE_NUMBER_GENERATION_TERRITORY];

//CAM GROUPS
const GET_CAM_API_GROUP: string[] = [
  GET_CAM_USER_STATUS_AND_ROLE,
  GET_CAM_ORGANISATIONS_USERS,
  GET_CAM_ORGANISATION_DETAILS,
];
const POST_CAM_API_GROUP: string[] = [
  POST_CAM_CREATE_USER,
  POST_CAM_CHANGE_USER_STATUS,
  POST_CAM_CREATE_WEB_USER_ACCOUNT_ROLE_AND_ORGANISATION_PERSON_ROLE,
];

// Dossier ID GROUPS
const GET_PL_DOSSIER_ID: string[] = [PL_DOSSIER_TYPE];
const POST_PL_GENERATE_DOSSIER_ID: string[] = [PL_GENERATE_DOSSIER_ID];
/*====================================================================================================================================*/
//FINAL END POINT GROUPS OBJECT
//Add all the Groups in this common group
const endpointGroups: Record<string, string[]> = {
  GET_CAM_API_GROUP,
  POST_CAM_API_GROUP,
  GET_PL_NUMBER_GENERATION,
  POST_PL_NUMBER_GENERATION,
  CMS_GET_CHOOSE_SUBMISSION_TYPE,
  GET_PL_TYA,
  GET_PL_DOSSIER_ID,
  POST_PL_GENERATE_DOSSIER_ID,
  GET_PL_TYA_RECLASSIFICATION,
  GET_PL_TYA_TERRITORY,
  GET_PL_PRODUCT_CLASS_TYPES,
};

export default endpointGroups;
