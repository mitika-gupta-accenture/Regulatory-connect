import { RootState } from "../store/store";

export const formDataSelector = (state: RootState) => state.applicationFormReducer.applicationFormData;

export const formFieldsDataSelector = (state: RootState) => state.applicationFormFieldsReducer.applicationFormFieldsData;

export const formErrDataSelector = (state: RootState) => state.applicationFormReducer.applicationFormFieldError;
export const formTitleDataSelector = (state: RootState) => state.applicationFormReducer.applicationFormTitleData;
