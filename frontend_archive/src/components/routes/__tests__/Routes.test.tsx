import React from "react";
import { render } from "@testing-library/react";
import { useDispatch, useSelector } from "react-redux";
import "@testing-library/jest-dom";
import PageRoutesAndNavigation from "../Routes";
import { MemoryRouter } from "react-router-dom";
import configureMockStore from "redux-mock-store";
import { mockFormData, mockFormFieldsData } from "../../../core/store/mockState";


const mockStore = configureMockStore()
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn().mockImplementation(selector => selector()),
}));

jest.mock("../../../core/hooks/useNavigation", () => ({
  __esModule: true,
  default: () => ({
    nextPage: jest.fn(),
    previousPage: jest.fn(),
  })
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

beforeEach(() => {
  (useSelector as unknown as jest.Mock)
    .mockReturnValue({})
    .mockReturnValueOnce(mockFormData)
    .mockReturnValueOnce(mockFormFieldsData);
});
jest.mock("../../static/CancelApp", () => () => <div data-testid="cancel-app">Cancel App Content</div>);
jest.mock("../../../configuration/tailorYourApp.json", () => ({
  pages: [

    {
      "name": "TailorYourApp",
      "showSubmitButton": true,
      "navigationCondition": "",
      "component": "sections",
      "sections": [
        {
          "name": "TailorYourApp_1",
          "component": "sections",
          "displayOrder": 1,
          "children": [
            {
              "name": "beforeYouStartLabel",
              "type": "label",
              "text": "Before you start",
              "size": "L",
              "displayOrder": 1
            },
            {
              "type": "paragraph",
              "displayOrder": 2,
              "className": "govuk-body govuk-!-margin-bottom-6",
              "text": "You will need to submit a separate PL application for each strength and pharmaceutical form or presentation of the product."
            },
            {
              "name": "TailorYourAppLabel",
              "type": "label",
              "text": "Section 1: Tailor your application",
              "displayOrder": 3
            },
            {
              "type": "paragraph",
              "displayOrder": 4,
              "className": "govuk-body govuk-!-margin-bottom-9",
              "text": "The first section is called 'Tailor your application' and comprises 6 to 10 questions. These questions govern how many other sections of the remaining application form you see."
            }
          ]
        }
      ]
    },
    {
      "name": "ChooseApplicationType",
      "showSubmitButton": true,
      "navigationCondition": [
        {
          "or": [
            {
              "equals": {
                "selectAppTypeRadio": "biological"
              }
            }
          ],
          "then": "BiologicalSubstance"
        },
        {
          "or": [
            {
              "equals": {
                "selectAppTypeRadio": "chemical"
              }
            }
          ],
          "then": "ChemicalSubstance"
        },
        {
          "or": [
            {
              "equals": {
                "selectAppTypeRadio": "traditionalHerbal"
              }
            }
          ],
          "then": "TraditionalHerbalSubstance"
        },
        {
          "or": [
            {
              "equals": {
                "selectAppTypeRadio": "herbal"
              }
            },
            {
              "equals": {
                "selectAppTypeRadio": "homeoNat"
              }
            },
            {
              "equals": {
                "selectAppTypeRadio": "radioPharmaceutical"
              }
            },
            {
              "equals": {
                "selectAppTypeRadio": "homeoHR"
              }
            }
          ],
          "then": "MultipleCompanyAddress"
        }
      ],
      "showCancelButton": true,
      "sections": [
        {
          "name": "submitApplicationForm_1",
          "component": "sections",
          "layout": "full",
          "displayOrder": 1,
          "children": [
            {
              "name": "licenceApplicationLabelCaption",
              "type": "caption",
              "text": "Tailor your application",
              "displayOrder": 1
            },
            {
              "name": "selectAppTypeRadio",
              "type": "radios",
              "text": "What type of application are you making?",
              "size": "M",
              "toolTip": "Select one.",
              "displayOrder": 2,
              "options": [
                {
                  "title": "Biological",
                  "value": "biological",
                  "children": [
                    {
                      "name": "selectAtmpCheckbox",
                      "type": "checkboxes",
                      "toolTip": "Select all that apply.",
                      "displayOrder": 1,
                      "options": [
                        {
                          "title": "ATMP",
                          "value": "atmp"
                        },
                        {
                          "title": "Blood derived medicinal product",
                          "value": "bloodDerived"
                        },
                        {
                          "title": "Non-recombinant (extracted) protein",
                          "value": "nonRecombinant"
                        },
                        {
                          "title": "Recombinant protein",
                          "value": "recombinant"
                        },
                        {
                          "title": "Urine derived medicinal product",
                          "value": "urineDerived"
                        },
                        {
                          "title": "Vaccine",
                          "value": "vaccine"
                        },
                        {
                          "title": "Other biological product",
                          "value": "otherBio"
                        }
                      ]
                    }
                  ]
                },
                {
                  "title": "Chemical",
                  "value": "chemical"
                },
                {
                  "title": "Herbal",
                  "value": "herbal"
                },
                {
                  "title": "Homeopathic National Rules (NR)",
                  "value": "homeoNat"
                },
                {
                  "title": "Radiopharmaceutical",
                  "value": "radioPharmaceutical"
                },
                {
                  "title": "Simplified Homeopathic Registration (HR)",
                  "value": "homeoHR"
                },
                {
                  "title": "Traditional Herbal Registration (THR)",
                  "value": "traditionalHerbal",
                  "children": [
                    {
                      "type": "paragraph",
                      "displayOrder": 1,
                      "text": "Specify the form your medicinal product presented in."
                    },
                    {
                      "name": "selectTraditionalHerbalRadioGroup",
                      "type": "radios",
                      "displayOrder": 2,
                      "options": [
                        {
                          "title": "Essential oil",
                          "value": "EssenOil"
                        },
                        {
                          "title": "Fatty oil",
                          "value": "FatOil"
                        },
                        {
                          "title": "Herbal tea",
                          "value": "HerbTea"
                        },
                        {
                          "title": "Herbal tincture",
                          "value": "HerbTin"
                        },
                        {
                          "title": "Only herbal substances in a capsule",
                          "value": "HerbSubstance"
                        },
                        {
                          "title": "None of the above",
                          "value": "None"
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "name": "CancelApplication",
      "component": "sections",
      "sections": [
        {
          "name": "CancelApp_1",
          "component": "sections",
          "displayOrder": 1,
          "children": [
            {
              "name": "cancelAppLabel",
              "type": "label",
              "text": "Cancel your application",
              "displayOrder": 1
            },
            {
              "type": "paragraph",
              "displayOrder": 2,
              "text": "If you cancel your application, all the information you have entered will be lost.",
              "className": "govuk-body govuk-!-margin-bottom-9"
            },
            {
              "type": "paragraph",
              "displayOrder": 3,
              "text": "Are you sure you want to cancel your application?"
            },
            {
              "name": "cancelAppButton",
              "type": "button",
              "text": "Cancel application",
              "toolTip": "",
              "displayOrder": 4,
              "children": [],
              "disabled": false,
              "visible": true,
              "theme": "warning",
              "navigationCondition": "TailorYourApp",
              "events": [
                {
                  "event": "onClick",
                  "eventHandler": "clearSessionAndNavigate"
                }
              ]
            },
            {
              "name": "returnLink ",
              "type": "prevLink",
              "text": "Back to previous page",
              "displayOrder": 5
            }
          ]
        }
      ]
    },
    {
      "name": "CancelApp",
      "staticRoute": true
    }
  ]
}));
describe("Routes", () => {
  const mockDispatch = jest.fn();
  (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);

  it("renders '/ChooseApplicationType' route as default behaviour", () => {
    const { getByText } = render(<MemoryRouter initialEntries={["/ChooseApplicationType"]}>
      <PageRoutesAndNavigation />
    </MemoryRouter>);

    expect(getByText("Cancel application")).toBeInTheDocument();
    expect(getByText("Continue")).toBeInTheDocument()
  });

  it("renders '/TailorYourApp' route as default behaviour", () => {
    const { getByText, queryByText } = render(<MemoryRouter initialEntries={["/TailorYourApp"]}>
      <PageRoutesAndNavigation />
    </MemoryRouter>);
    expect(getByText("Continue")).toBeInTheDocument();
    expect(queryByText("Cancel application")).toBeNull();
  });
  it("renders '/unknown-route' route as default behaviour", () => {
    const { container } = render(<MemoryRouter initialEntries={["/unknown-route"]}>
      <PageRoutesAndNavigation />
    </MemoryRouter>);
    expect(container.firstChild).toBeNull();
  });

  it("renders '/CancelApplication' route as default behaviour", () => {
    const { getByText } = render(<MemoryRouter initialEntries={["/CancelApplication"]}>
      <PageRoutesAndNavigation />
    </MemoryRouter>);
    expect(getByText("Cancel application")).toBeInTheDocument();
  });

});
