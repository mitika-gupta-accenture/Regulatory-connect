import { configureStore } from "@reduxjs/toolkit";
import applicationFormSlice from "../../features/applicationForm/applicationFormSlice";
import applicationHistorySlice from "../../features/applicationHistory/applicationHistorySlice";
import applicationFormFieldsSlice from "../../features/applicationFormFields/applicationFormFieldsSlice";
import { store, sessionStorageMiddleware, reHydrateStore } from "../store";
import { GetDefaultMiddleware } from "@reduxjs/toolkit/dist/getDefaultMiddleware";

describe("store configuration", () => {
  it("should configure the store with reducers and middleware", () => {

    const testStore = configureStore({
      reducer: {
        applicationFormReducer: applicationFormSlice,
        applicationFormFieldsReducer: applicationFormFieldsSlice,
        applicationHistoryReducer: applicationHistorySlice,
      },
      preloadedState: reHydrateStore(),
      middleware: (getDefaultMiddleware: GetDefaultMiddleware<any>) =>
        getDefaultMiddleware().concat(sessionStorageMiddleware),
    });

    // Perform assertions
    expect(testStore.getState()).toEqual(store.getState()); // Compare initial states
    // More assertions can be added based on your specific needs
  });

  it("should save the state to sessionStorage", () => {
    const mockSetItem = jest.spyOn(window.sessionStorage.__proto__, "setItem");
    const mockNext = jest.fn();
    const mockAction = { type: "TEST_ACTION" };

    const result = sessionStorageMiddleware()(mockNext)(mockAction);

    // Perform assertions
    expect(mockSetItem).toHaveBeenCalledWith(
      "applicationState",
      JSON.stringify(store.getState())
    );
    expect(result).toBeUndefined(); // Ensure the result is undefined
    expect(mockNext).toHaveBeenCalledWith(mockAction);
  });

  it("should re-hydrate the store when sessionStorage has stored state", () => {
    const mockStoredState = { key: "value" };
    jest
      .spyOn(window.sessionStorage.__proto__, "getItem")
      .mockReturnValue(JSON.stringify(mockStoredState));

    // Execute the function
    const result = reHydrateStore();

    // Perform assertions
    expect(result).toEqual(mockStoredState);
  });

  it('should call sessionStorage.getItem() with "applicationState"', () => {
    const mockGetItem = jest.spyOn(window.sessionStorage.__proto__, "getItem");

    // Execute the function
    reHydrateStore();

    // Perform assertions
    expect(mockGetItem).toHaveBeenCalledWith("applicationState");
  });

  it("should call JSON.parse() with the result of sessionStorage.getItem()", () => {
    const mockGetItem = jest
      .spyOn(window.sessionStorage.__proto__, "getItem")
      .mockReturnValue("{}");
    const mockParse = jest.spyOn(JSON, "parse");

    // Execute the function
    reHydrateStore();

    // Perform assertions
    expect(mockParse).toHaveBeenCalledWith("{}");
    expect(mockGetItem).toHaveBeenCalled();
  });

  it("should handle re-hydration when sessionStorage does not have stored state", () => {
    jest
      .spyOn(window.sessionStorage.__proto__, "getItem")
      .mockReturnValue(null);

    // Execute the function
    const result = reHydrateStore();

    // Perform assertions
    expect(result).toEqual({});
  });
});
