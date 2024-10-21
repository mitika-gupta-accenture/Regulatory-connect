import { Slice, createSlice } from "@reduxjs/toolkit";
import InitialState from "../../store/initialState";
import { RootState } from "../../store/store";

interface ApplicationFormFieldsState {
  applicationFormFieldsData: Record<any, any>;
}

const initialState: ApplicationFormFieldsState = {
  applicationFormFieldsData: {
    userData: {
      // replace with dynamic user data
      // currently not being used to populate labels yet
      companyAddresses: [
        {companyName: "Big Company Ltd", address: "Mayson House, Maynard Industrial Estate, Halifax, HX4 6TY, UK"},
        // uncomment this to get to multiple addresses page
        // {companyName: "Big Company Ltd", address: "Mayson House, Maynard Industrial Estate, Halifax, HX4 6TY, UK"}
      ]
    }
  }
};

const applicationFormFieldsSlice: Slice<ApplicationFormFieldsState> =
  createSlice({
    name: "applicationFormFieldsReducer",
    initialState: { ...InitialState, ...initialState },
    reducers: {
      getApplicationFormFieldsData: (state: ApplicationFormFieldsState) => {
        return state;
      },
      setApplicationFormFieldsData: (state, action) => {
        state.applicationFormFieldsData = {
          ...state.applicationFormFieldsData,
          ...action.payload,
        };
      },
    },
  });

export const { getApplicationFormFieldsData, setApplicationFormFieldsData } =
  applicationFormFieldsSlice.actions;
export const applicationFormFieldsData = (
  state: RootState
): ApplicationFormFieldsState => state.applicationFormFieldsReducer;
export default applicationFormFieldsSlice.reducer;