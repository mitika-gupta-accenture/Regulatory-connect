import { renderHook } from "@testing-library/react-hooks";
import { useDispatch} from "react-redux";
import useTriggerEvents from "../useTriggerEvents";
import {
  getApplicationType,
  getCompaniesDetails,
  getCompanyDetails,
  getDeclarationPageData,
  getLicenceNum,
  getSubmissionTypeData,
} from "../../services/applicationFormFieldsDataServices";
import { setApplicationFormFieldsData } from "../../features/applicationFormFields/applicationFormFieldsSlice";
import {
  setApplicationFormData,
  setApplicationFormTitleData,
  deleteApplicationFormData,
  deleteApplicationFormTitleData,
  addFormFieldError,
  clearFormFieldErrors,
  setShowErrors,
  deleteFormFieldError,
} from "../../features/applicationForm/applicationFormSlice";

// Mocking the dependencies and services used in the hook
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"), // Preserve other exports
  useDispatch: jest.fn(),
}));

jest.mock("../useNavigation", () => ({
  __esModule: true,
  default: () => ({
    nextPage:  jest.fn(),
    previousPage: jest.fn(),
  })
}));

// Mock the services
jest.mock("../../services/applicationFormFieldsDataServices", () => ({
  getApplicationType: jest.fn(),
  getLicenceNum: jest.fn(),
  getSubmissionTypeData: jest.fn(),
  getDeclarationPageData: jest.fn(),
  getCompaniesDetails: jest.fn(),
  getCompanyDetails: jest.fn(),
}));

// Mock the action creators
jest.mock(
  "../../features/applicationFormFields/applicationFormFieldsSlice",
  () => ({
    setApplicationFormFieldsData: jest.fn(),
  })
);

// Mocking the Redux actions
jest.mock("../../features/applicationForm/applicationFormSlice", () => ({
  setApplicationFormData: jest.fn(),
  deleteApplicationFormData: jest.fn(),
  deleteApplicationFormTitleData: jest.fn(),
  addFormFieldError: jest.fn(),
  deleteFormFieldError: jest.fn(),
  setShowErrors: jest.fn(),
  setApplicationFormTitleData: jest.fn(),
  clearFormFieldErrors: jest.fn(),
}));
const useDispatchMock = useDispatch as unknown as jest.Mock;

describe("useTriggerEvents hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("scrollToTop event scrolls to the top of the page", () => {
    const { triggerEvent } = useTriggerEvents();
    window.scrollTo = jest.fn();
    triggerEvent("scrollToTop");
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });

  test("handleChange event dispatches setApplicationFormData and setApplicationFormTitleData actions", () => {
    const dispatch = jest.fn();
    (
      useDispatchMock as jest.MockedFunction<typeof useDispatchMock>
    ).mockReturnValue(dispatch);
    const { triggerEvent } = useTriggerEvents();
    triggerEvent("handleChange", {
      name: "fieldName",
      value: "fieldValue",
      title: "fieldTitle",
    });
    expect(setApplicationFormData).toHaveBeenCalledWith({
      fieldName: "fieldValue",
    });
    expect(setApplicationFormTitleData).toHaveBeenCalledWith({
      fieldName: "fieldTitle",
    });
  });

  test("deleteFormData event dispatches deleteApplicationFormData and deleteApplicationFormTitleData actions", () => {
    const dispatch = jest.fn();
    (
      useDispatchMock as jest.MockedFunction<typeof useDispatchMock>
    ).mockReturnValue(dispatch);
    const { triggerEvent } = useTriggerEvents();
    triggerEvent("deleteFormData", { name: "fieldName" });
    expect(deleteApplicationFormData).toHaveBeenCalledWith("fieldName");
    expect(deleteApplicationFormTitleData).toHaveBeenCalledWith("fieldName");
  });

  test("getApplicationType event calls getApplicationType service function with correct arguments", async () => {
    const dispatch = jest.fn();
    (
      useDispatchMock as jest.MockedFunction<typeof useDispatchMock>
    ).mockReturnValue(dispatch);
  
    const responseData = { applicationType: "exampleType" };
    (getApplicationType as jest.Mock).mockImplementationOnce(async (dispatch) => {
      dispatch(setApplicationFormFieldsData(responseData));
    });
    const { result } = renderHook(() => useTriggerEvents());
    const { triggerEvent } = result.current;
    triggerEvent("getServiceParameter"); // Remove here
    expect(getApplicationType).toHaveBeenCalledWith(dispatch);
  
    // Verify if the setApplicationFormFieldsData action creator is called with the correct payload
    expect(setApplicationFormFieldsData).toHaveBeenCalledWith(responseData);
  });

  test("getSubmissionTypeData event calls getSubmissionTypeData service function with correct arguments", async () => {
    const dispatch = jest.fn();
    (
      useDispatchMock as jest.MockedFunction<typeof useDispatchMock>
    ).mockReturnValue(dispatch);
  
    const responseData = { submissionType: "exampleSubmissionType" };
    (getSubmissionTypeData as jest.Mock).mockImplementationOnce(async (dispatch) => {
      dispatch(setApplicationFormFieldsData(responseData));
    });
    const { result } = renderHook(() => useTriggerEvents());
    const { triggerEvent } = result.current;
    triggerEvent("getSubmissionTypeData");
    expect(getSubmissionTypeData).toHaveBeenCalledWith(dispatch);
    // Verify if the setApplicationFormFieldsData action creator is called with the correct payload
    expect(setApplicationFormFieldsData).toHaveBeenCalledWith(responseData);
  });

  test("getDeclarationPageData event calls getDeclarationPageData service function with correct arguments", async () => {
    const dispatch = jest.fn();
    (
      useDispatchMock as jest.MockedFunction<typeof useDispatchMock>
    ).mockReturnValue(dispatch);
  
    const responseData = { declarationData: "exampleDeclarationData" };
    (getDeclarationPageData as jest.Mock).mockImplementationOnce(async (dispatch) => {
      dispatch(setApplicationFormFieldsData(responseData));
    });
    const { result } = renderHook(() => useTriggerEvents());
    const { triggerEvent } = result.current;
    triggerEvent("getDeclarationPageData");
    expect(getDeclarationPageData).toHaveBeenCalledWith(dispatch);
  
    // Verify if the setApplicationFormFieldsData action creator is called with the expected payload
    expect(setApplicationFormFieldsData).toHaveBeenCalledWith(responseData);
  });

  test("getCompanyDetails event calls getCompanyDetails service function with correct arguments", async () => {
    const dispatch = jest.fn();
    (
      useDispatchMock as jest.MockedFunction<typeof useDispatchMock>
    ).mockReturnValue(dispatch);
  
    const responseData = { companyDetails: "exampleCompanyDetails" };
    (getCompanyDetails as jest.Mock).mockImplementationOnce(async (dispatch) => { 
      dispatch(setApplicationFormFieldsData(responseData));
    });
    const { result } = renderHook(() => useTriggerEvents());
    const { triggerEvent } = result.current;
    triggerEvent("getCompanyDetails");
    expect(getCompanyDetails).toHaveBeenCalledWith(dispatch);
  
    // Verify if the setApplicationFormFieldsData action creator is called with the expected payload
    expect(setApplicationFormFieldsData).toHaveBeenCalledWith(responseData);
  });

  test("getCompaniesDetails event calls getCompaniesDetails service function with correct arguments", async () => {
    const dispatch = jest.fn();
    (
      useDispatchMock as jest.MockedFunction<typeof useDispatchMock>
    ).mockReturnValue(dispatch);
  
    const responseData = { companiesDetails: "exampleCompaniesDetails" };
    (getCompaniesDetails as jest.Mock).mockImplementationOnce(async (dispatch) => {
      dispatch(setApplicationFormFieldsData(responseData));
    });  
    const { result } = renderHook(() => useTriggerEvents());
    const { triggerEvent } = result.current;
    triggerEvent("getCompaniesDetails");
    expect(getCompaniesDetails).toHaveBeenCalledWith(dispatch);
  
    // Verify if the setApplicationFormFieldsData action creator is called with the expected payload
    expect(setApplicationFormFieldsData).toHaveBeenCalledWith(responseData);
  });

  test("getLicenceNum event calls getLicenceNum service function with correct arguments", async () => {
    const dispatch = jest.fn();
    (
      useDispatchMock as jest.MockedFunction<typeof useDispatchMock>
    ).mockReturnValue(dispatch);
  
    const responseData = { licenceNum: "exampleLicenceNum" };
    (getLicenceNum as jest.Mock).mockImplementationOnce(async (dispatch, request) => {
      dispatch(setApplicationFormFieldsData(responseData));
    });
  
    const { result } = renderHook(() => useTriggerEvents());
    const { triggerEvent } = result.current;
    triggerEvent("getLicenceNum", {
      name: "licence",
      value: "licenceValue",
    });
    expect(getLicenceNum).toHaveBeenCalledWith(dispatch, "licenceValue");
    // Verify if the setApplicationFormFieldsData action creator is called with the expected payload
    expect(setApplicationFormFieldsData).toHaveBeenCalledWith(responseData);
  });
  
  test("addFormFieldError event calls dispatch with correct data when name and value are not empty", () => {
    const dispatch = jest.fn();
    (
      useDispatchMock as jest.MockedFunction<typeof useDispatchMock>
    ).mockReturnValue(dispatch);

    const { result } = renderHook(() => useTriggerEvents());
    const { triggerEvent } = result.current;
    const name = "fieldName";
    const value = "error message";
    triggerEvent("addFormFieldError", { name, value });
    expect(dispatch).toHaveBeenCalledWith(addFormFieldError({ [name]: value }));
  });

  test("previousPage event calls previousPage function", () => {
    const previousPageMock = jest.fn();
    jest.mock("../useNavigation", () => ({
      __esModule: true,
      default: () => ({
        nextPage: jest.fn(), 
        previousPage: previousPageMock,
      })
    }));
    
    const { result } = renderHook(() => useTriggerEvents());
    const { triggerEvent } = result.current;
    triggerEvent("previousPage");
  });

  test("deleteFormFieldError event calls dispatch with correct data", () => {
    const dispatch = jest.fn();
    (
      useDispatchMock as jest.MockedFunction<typeof useDispatchMock>
    ).mockReturnValue(dispatch);

    const { result } = renderHook(() => useTriggerEvents());
    const { triggerEvent } = result.current;
    const value = "fieldName";
    triggerEvent("deleteFormFieldError", { value });
    expect(dispatch).toHaveBeenCalledWith(
      deleteFormFieldError({ formFieldErrors: value })
    );
  });

  test("setShowErrors event calls dispatch with correct data", () => {
    const dispatch = jest.fn();
    (
      useDispatchMock as jest.MockedFunction<typeof useDispatchMock>
    ).mockReturnValue(dispatch);

    const { result } = renderHook(() => useTriggerEvents());
    const { triggerEvent } = result.current;
    const value = true;
    triggerEvent("setShowErrors", { value });
    expect(dispatch).toHaveBeenCalledWith(setShowErrors({ showErrors: value }));
  });

  test("clearFormFieldErrors event calls dispatch with correct data", () => {
    const dispatch = jest.fn();
    (
      useDispatchMock as jest.MockedFunction<typeof useDispatchMock>
    ).mockReturnValue(dispatch);

    const { result } = renderHook(() => useTriggerEvents());
    const { triggerEvent } = result.current;

    triggerEvent("clearFormFieldErrors");
    expect(dispatch).toHaveBeenCalledWith(clearFormFieldErrors({}));
  });

  test("submit event does not throw an error", () => {
    const { result } = renderHook(() => useTriggerEvents());
    const { triggerEvent } = result.current;
    expect(() => triggerEvent("submit")).not.toThrow();
  });
  
});


