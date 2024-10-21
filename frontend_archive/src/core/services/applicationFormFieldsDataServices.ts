import { _get, _getCMSData, _generateAccessToken } from "./apiService";
import {
  GET_APPLICATION_TYPE,
  GET_SUBMISSION_TYPE,
  GET_DECLARATION_PAGE_DATA,
  GET_COMPANY,
  GET_COMPANIES,
  GET_TOKEN
} from "../constants/endpoints";
import { setApplicationFormFieldsData } from "../features/applicationFormFields/applicationFormFieldsSlice";
import { AppDispatch } from "../store/store";

export const getApplicationType = async (dispatch: AppDispatch) => {
  const response = await _get(GET_APPLICATION_TYPE);
  dispatch(setApplicationFormFieldsData(response?.data));
};

export const getLicenceNum = async (dispatch: AppDispatch, request: string) => {
    const allLicenceNums = {data: {licenceNum: ['AA11', 'AA12', 'AA13', 'AA14', 'AA15', 'AA16', 'AA17', 'AA18', 'AA19', 'AA20', 'AA21', 'AA22', 'AA23', 'BB12', 'BB13','BB14']}}
    dispatch(setApplicationFormFieldsData({licenceNum: allLicenceNums.data.licenceNum}));
}

export const getCompaniesDetails = async (dispatch: AppDispatch) => {
  const response = await _get(GET_COMPANIES);
  dispatch(setApplicationFormFieldsData(response?.data));
};

export const getCompanyDetails = async (dispatch: AppDispatch) => {
  const response = await _get(GET_COMPANY);
  dispatch(setApplicationFormFieldsData(response?.data));
};

export const getAccessToken = async () => {
  try {
    const response = await _generateAccessToken(GET_TOKEN);
    localStorage.setItem("cms_access_token", response.data.access_token);
  } catch (error: any) {
    console.log("Error in fetchCMSAPIToken", error);
    throw error;
  }
};

setInterval(() => {
  getAccessToken();
}, 3590000);

const generateHeaders = () => ({
  "Content-Type": "application/json",
  ...(localStorage.getItem("cms_access_token") && {
    Authorization: `Bearer ${localStorage.getItem("cms_access_token")}`,
  }),
});

export const getSubmissionTypeData = async (dispatch: AppDispatch) => {
  try { 
    if (!localStorage.getItem("cms_access_token")) {
      await getAccessToken();
    }
    const response = await _getCMSData(GET_SUBMISSION_TYPE, {...generateHeaders()});
    dispatch(
      setApplicationFormFieldsData( response?.data?.data?.attributes)
    );
  } catch (error: any) {
    console.log("Error in fetching submission type data", error);
    throw error;
  }
};

export const getDeclarationPageData = async (dispatch: AppDispatch) => {
  const response = await _getCMSData(GET_DECLARATION_PAGE_DATA);
  dispatch(setApplicationFormFieldsData(response?.data?.data?.attributes));
};
