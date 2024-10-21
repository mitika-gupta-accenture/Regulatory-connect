import { configureStore } from "@reduxjs/toolkit";
import applicationHistorySlice, {
  addRouteToApplicationHistory,
  applicationHistoryData,
  deleteRouteFromApplicationHistory,
  getApplicationHistoryData,
} from "../applicationHistorySlice";
import { RootState } from "../../../store/store";

test("should add & delete route", () => {
  const store = configureStore({ reducer: applicationHistorySlice });
  store.dispatch(addRouteToApplicationHistory("tailerYourApplication"));
  const res = store.getState();
  expect(res.applicationHistoryData).toContain("tailerYourApplication");
  store.dispatch(
    deleteRouteFromApplicationHistory("tailerYourApplication")
  );
  expect(store.getState().applicationHistoryData).not.toContain(
    "tailerYourApplication"
  );
});

test("initial state is set correctly", () => {
  const store = configureStore({ reducer: applicationHistorySlice });
  const initialState = store.getState();
  expect(initialState.applicationHistoryData).toEqual([]);
});

test("get application history data returns correct state", () => {
  const store = configureStore({ reducer: applicationHistorySlice });
  store.dispatch(addRouteToApplicationHistory("tailerYourApplication"));
  const res = store.getState();
  expect(res.applicationHistoryData).toContain("tailerYourApplication");
  store.dispatch(getApplicationHistoryData("tailerYourApplication"));
  expect(store.getState().applicationHistoryData).toContain(
    "tailerYourApplication"
  );
});

test("applicationHistoryData selector returns correct data from RootState", () => {
  const mockRootState: RootState = {
    applicationHistoryReducer: {
      applicationHistoryData: ["route1", "route2"],
    },
  };

  const selectedData = applicationHistoryData(mockRootState);
  expect(selectedData).toEqual({
    applicationHistoryData: ["route1", "route2"],
  });
});