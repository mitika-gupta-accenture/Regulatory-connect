import { useDispatch } from "react-redux";
import useNavigation from "./useNavigation";
import { setApplicationFormData, deleteApplicationFormData, deleteApplicationFormTitleData, addFormFieldError, deleteFormFieldError, setShowErrors, setApplicationFormTitleData, clearFormFieldErrors } from "../features/applicationForm/applicationFormSlice";
import { getApplicationType, getLicenceNum, getSubmissionTypeData, getDeclarationPageData, getCompaniesDetails, getCompanyDetails } from "../services/applicationFormFieldsDataServices";
import { AppDispatch } from "../store/store";

const useTriggerEvents = () => {
  const { nextPage, previousPage } = useNavigation();
  const dispatch: AppDispatch = useDispatch();
  const triggerEvent = (
    event: string,
    data: Record<string, any> = { name: "", value: "" }
  ) => {
    const { name, value, title } = data;
    switch (event) {
      case "scrollToTop":
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        break;

      case "handleChange":
        if (name !== "") {
          dispatch(setApplicationFormData({ [name]: value }));
          dispatch(setApplicationFormTitleData({ [name]: title || value }));
        }
        break;

      case "deleteFormData":
        dispatch(deleteApplicationFormData(name));
        dispatch(deleteApplicationFormTitleData(name));
        break;

      case "getServiceParameter":
        getApplicationType(dispatch);
        break;

      case "getLicenceNum":
        getLicenceNum(dispatch, value);
        break;

      case "getSubmissionTypeData":
        getSubmissionTypeData(dispatch);
        break;

      case "getDeclarationPageData":
        getDeclarationPageData(dispatch);
        break;

      case "getCompanyDetails":
        getCompanyDetails(dispatch);
        break;

      case "getCompaniesDetails":
        getCompaniesDetails(dispatch);
        break;

      case "previousPage":
        previousPage();
        break;

      case "submit":

        break;

      case "nextPage":
        nextPage(value);
        break;

      case "addFormFieldError":
        if (name !== "" && value !== "") {
          dispatch(addFormFieldError({ [name]: value }));
        }
        break;

      case "deleteFormFieldError":
        dispatch(deleteFormFieldError({ 'error': value }));
        break;

      case "setShowErrors":
        dispatch(setShowErrors({ 'showErrors': value }))
        break;

      case "clearFormFieldErrors":
        dispatch(clearFormFieldErrors({}))
        break;

      default:
        nextPage();
        break;
    }
  };
  return { triggerEvent };
};

export default useTriggerEvents;
