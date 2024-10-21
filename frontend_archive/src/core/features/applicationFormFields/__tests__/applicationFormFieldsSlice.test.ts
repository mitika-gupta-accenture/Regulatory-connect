import { configureStore } from "@reduxjs/toolkit";
import applicationFormFieldsSlice, {
  setApplicationFormFieldsData,
  getApplicationFormFieldsData,
  applicationFormFieldsData,
} from "../applicationFormFieldsSlice";

describe("Application Form Fields Slice", () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({ reducer: applicationFormFieldsSlice });
  });

  test("should set application form field data", async () => {
    await store.dispatch(setApplicationFormFieldsData({ applicationType: ['Biological', 'Chemical', 'Herbal'] }));
    const res = store.getState();
    expect(res.applicationFormFieldsData.applicationType).toEqual(['Biological', 'Chemical', 'Herbal']);
  });

  test("should get application form field data", () => {
    const initialState = {
      applicationType: ['Biological', 'Chemical', 'Herbal'], 
      applicationFormFieldsData: {
        applicationType: ['Biological', 'Chemical', 'Herbal'],
      },
    };
    store = configureStore({ reducer: applicationFormFieldsSlice, preloadedState: initialState });
    store.dispatch(getApplicationFormFieldsData({}));
    const currentState = store.getState();

    expect(currentState).toEqual(initialState);
  });

  test("should return correct application form fields data format", () => {
    const state = {
      applicationFormFieldsReducer: {
        applicationType: ['Biological', 'Chemical', 'Herbal'], 
        applicationFormFieldsData: {
          userData: {
            companyAddresses: [
              { companyName: "Big Company Ltd", address: "Mayson House, Maynard Industrial Estate, Halifax, HX4 6TY, UK" },
            ]
          }
        },
      },
    };

    const selectedData = applicationFormFieldsData(state);
    expect(selectedData).toEqual({
      applicationType: ['Biological', 'Chemical', 'Herbal'],
      applicationFormFieldsData: {
        userData: {
          companyAddresses: [
            { companyName: "Big Company Ltd", address: "Mayson House, Maynard Industrial Estate, Halifax, HX4 6TY, UK" },
          ]
        }
      }
    });
  });

  test("should overwrite existing application form field data", async () => {
    await store.dispatch(setApplicationFormFieldsData({ applicationType: ['Biological', 'Chemical', 'Herbal'] }));
    await store.dispatch(setApplicationFormFieldsData({ applicationType: ['NewType'] }));

    const currentState = store.getState();
    expect(currentState.applicationFormFieldsData.applicationType).toEqual(['NewType']);
  });

  test("should not affect existing data when setting empty data", async () => {
    await store.dispatch(setApplicationFormFieldsData({ applicationType: ['Biological', 'Chemical', 'Herbal'] }));
    await store.dispatch(setApplicationFormFieldsData({}));

    const currentState = store.getState();
    expect(currentState.applicationFormFieldsData.applicationType).toEqual(['Biological', 'Chemical', 'Herbal']);
  });

  

});
