export const mockFormData = {
    chemicalLegalStatusChangeRadioGroup: "Yes",
    territoryRadioGroup: "UK",
    selectAppTypeRadio: "homeoHR",
};

export const mockFormFieldsData = {
    companies: [
        {
            name: "Big Company Ltd",
            address: "Address line 1, City, Postcode, Sweden",
        },
        {
            name: "Big Company Ltd",
            address: "Address line 1, City, Postcode, France",
        },
    ],
};

export const mockState = {
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
            territory: ["My User Territory"],
        },
        applicationFormFieldError: {
            formFieldErrors: { test: "please remove" }
        },
        applicationFormTitleData: { territory: ["My User Territory"] }
    },
    applicationHistoryReducer: {
        applicationHistoryData: []
    }
};