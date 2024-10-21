import { PayloadAction, Slice, createSlice } from "@reduxjs/toolkit";
import InitialState from "../../store/initialState";
import { RootState } from "../../store/store";

interface ApplicationFormState {
  applicationFormData: Record<any, any>;
  applicationFormTitleData: Record<any, any>;
  applicationFormFieldError: Record<any, any>;
}

const initialState: ApplicationFormState = {
  applicationFormData: {},
  applicationFormTitleData: {},
  applicationFormFieldError: {
    formFieldErrors: {},
    showErrors: false,
  },
};

const applicationFormSlice: Slice<ApplicationFormState> = createSlice({
  name: "applicationFormReducer",
  initialState: { ...InitialState, ...initialState },
  reducers: {
    getApplicationFormData: (state: ApplicationFormState) => {
      if (state !== null) {
        return state;
      }
    },
    setApplicationFormData: (state, action: PayloadAction<Record<string, any>>) => {
      (state.applicationFormData !== null && action.payload != null) &&
        (state.applicationFormData = {
          ...state.applicationFormData,
          ...action.payload,
        });
    },
    setApplicationFormTitleData: (state, action: PayloadAction<Record<string, any>>) => {
      (state.applicationFormTitleData !== null && action.payload != null) &&
        (state.applicationFormTitleData = {
          ...state.applicationFormTitleData,
          ...action.payload,
        });
    },
    deleteApplicationFormData: (state, action: PayloadAction<string>) => {
      if (state.applicationFormData !== null && action.payload != null) {
        const { [action.payload]: valueToDelete, ...newApplicationFormData } =
          state.applicationFormData;
        state.applicationFormData = newApplicationFormData;
      }
    },
    deleteApplicationFormTitleData: (state, action: PayloadAction<string>) => {
      if (state.applicationFormTitleData !== null && action.payload != null) {
        const {
          [action.payload]: valueToDelete,
          ...newApplicationFormTitleData
        } = state.applicationFormTitleData;
        state.applicationFormTitleData = newApplicationFormTitleData;
      }
    },
    addFormFieldError: (state, action: PayloadAction<Record<string, any>>) => {
      (state.applicationFormFieldError !== null && action.payload != null) &&
        (state.applicationFormFieldError = {
          ...state.applicationFormFieldError,
          formFieldErrors: {
            ...state.applicationFormFieldError.formFieldErrors,
            ...action.payload,
          },
        });
    },
    deleteFormFieldError: (
      state,
      action: PayloadAction<Record<string, any>>
    ) => {
      const errorToDelete = action.payload.error;
      console.log({errorToDelete})
      delete state.applicationFormFieldError.formFieldErrors[errorToDelete];
    },
    setShowErrors: (state, action: PayloadAction<Record<string, boolean>>) => {
      (state.applicationFormFieldError !== null && action.payload != null) &&
        (state.applicationFormFieldError = {
          ...state.applicationFormFieldError,
          ...action.payload,
        });
    },
    clearFormFieldErrors: (state) => {
      state.applicationFormFieldError !== null &&
        (state.applicationFormFieldError = {
          ...state.applicationFormFieldError,
          formFieldErrors: {},
        });
    },
  },
});

export const {
  getApplicationFormData,
  setApplicationFormData,
  deleteApplicationFormData,
  setShowErrors,
  addFormFieldError,
  deleteFormFieldError,
  setApplicationFormTitleData,
  deleteApplicationFormTitleData,
  clearFormFieldErrors,
} = applicationFormSlice.actions;
export const applicationFormData = (state: RootState): ApplicationFormState =>
  state.applicationFormReducer;
export default applicationFormSlice.reducer;
