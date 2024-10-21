import configureMockStore from "redux-mock-store";

const ConMockStore = configureMockStore();

const mockStore = ConMockStore({
    applicationFormFieldsReducer: {
      applicationFormFieldsData: {
        territory: "My Territory",
      },
      applicationFormFieldError: {
        formFieldErr: "",
        validateField: "",
      }
    },
    applicationFormReducer: {
      applicationFormData: {
        territory: "My User Territory",
      },
    },
    applicationHistoryReducer: {
        applicationHistoryData: []
    }
});

export default mockStore;