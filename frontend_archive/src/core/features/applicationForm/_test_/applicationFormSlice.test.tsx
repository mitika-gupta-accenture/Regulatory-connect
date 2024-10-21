import { configureStore } from "@reduxjs/toolkit";
import applicationFormSlice, {
  deleteApplicationFormData,
  getApplicationFormData,
  setApplicationFormData,
  addFormFieldError,
  deleteFormFieldError,
  setApplicationFormTitleData,
  deleteApplicationFormTitleData,
  setShowErrors,
  clearFormFieldErrors,
  applicationFormData,
} from "../applicationFormSlice";
import initialState from "../../../store/initialState";
import { RootState } from "../../../store/store";

test("should set application form data", () => {
  const store = configureStore({ reducer: applicationFormSlice });
  store.dispatch(setApplicationFormData({ radioBtn: "BioLogical" }));
  const res = store.getState();
  expect(res.applicationFormData.radioBtn).toEqual("BioLogical");
});

test("should delete application form data", () => {
  const store = configureStore({ reducer: applicationFormSlice });
  store.dispatch(setApplicationFormData({ radioBtn: "BioLogical" }));
  const res = store.getState();
  expect(res.applicationFormData.radioBtn).toEqual("BioLogical");
  store.dispatch(deleteApplicationFormData("radioBtn"));
  expect(store.getState().applicationFormData).not.toHaveProperty("radioBtn");
});

test("should set application form title data", () => {
  const store = configureStore({ reducer: applicationFormSlice });
  store.dispatch(setApplicationFormTitleData({ title: "New Title" }));
  const res = store.getState();
  expect(res.applicationFormTitleData.title).toEqual("New Title");
});

test("should delete application form title data", () => {
  const store = configureStore({ reducer: applicationFormSlice });
  store.dispatch(setApplicationFormTitleData({ title: "New Title" }));
  const res = store.getState();
  expect(res.applicationFormTitleData.title).toEqual("New Title");
  store.dispatch(deleteApplicationFormTitleData("title"));
  expect(store.getState().applicationFormTitleData).not.toHaveProperty("title");
});

test("should set show errors", () => {
  const store = configureStore({ reducer: applicationFormSlice });
  store.dispatch(setShowErrors({ showErrors: true }));
  const res = store.getState();
  expect(res.applicationFormFieldError.showErrors).toEqual(true);
});

test("should delete form field error", () => {
  const store = configureStore({ reducer: applicationFormSlice });
  store.dispatch(deleteFormFieldError({}));
  const state = store.getState();
  expect(state.applicationFormFieldError.formFieldErrors).toEqual({});
});

test("should clear form field errors", () => {
  const store = configureStore({ reducer: applicationFormSlice });
  store.dispatch(clearFormFieldErrors({}));
  const state = store.getState();
  expect(state.applicationFormFieldError.formFieldErrors).toEqual({});
});

test("should add form field error", () => {
  const store = configureStore({ reducer: applicationFormSlice });
  store.dispatch(addFormFieldError({ email: "Invalid email format" }));
  const state = store.getState();
  expect(state.applicationFormFieldError.formFieldErrors.email).toEqual(
    "Invalid email format"
  );
});

test("should get application form data", () => {
  const store = configureStore({ reducer: applicationFormSlice });
  const formData = { field1: "value1", field2: "value2" };
  store.dispatch(getApplicationFormData(formData));
  const state = store.getState().applicationFormData;
  expect(state).toEqual(initialState);
});

test("should return application form data applicationFormData", () => {
  const mockState: RootState = {
    applicationFormReducer: {
      applicationFormData: {
        field1: "mockValue1",
        field2: "mockValue2",
      },
    },
  };

  const store = configureStore({
    reducer: applicationFormSlice,
    preloadedState: mockState,
  });

  const formData = applicationFormData(store.getState());

  expect(formData.applicationFormData).toEqual({
    field1: "mockValue1",
    field2: "mockValue2",
  });
});