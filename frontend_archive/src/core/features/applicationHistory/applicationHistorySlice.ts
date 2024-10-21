import { PayloadAction, Slice, createSlice } from "@reduxjs/toolkit";
import InitialState from "../../store/initialState";
import { RootState } from "../../store/store";

interface ApplicationHistoryState {
  applicationHistoryData: string[];
}

const initialState: ApplicationHistoryState = {
  applicationHistoryData: [],
};

const applicationHistorySlice: Slice<ApplicationHistoryState> = createSlice({
  name: "applicationHistoryReducer",
  initialState: { ...InitialState, ...initialState },
  reducers: {
    getApplicationHistoryData: (state: ApplicationHistoryState) => {
      return state;
    },
    addRouteToApplicationHistory: (
      state: ApplicationHistoryState,
      action: PayloadAction<string>
    ) => {
      state.applicationHistoryData = [
        ...new Set([...state.applicationHistoryData, action.payload]),
      ];
    },
    deleteRouteFromApplicationHistory: (
      state: ApplicationHistoryState,
      action: PayloadAction<string>
    ) => {
      state.applicationHistoryData = state.applicationHistoryData.filter(
        (item) => item !== action.payload
      );
    },
  },
});

export const {
  getApplicationHistoryData,
  addRouteToApplicationHistory,
  deleteRouteFromApplicationHistory,
} = applicationHistorySlice.actions;
export const applicationHistoryData = (
  state: RootState
): ApplicationHistoryState => state.applicationHistoryReducer;
export default applicationHistorySlice.reducer;
