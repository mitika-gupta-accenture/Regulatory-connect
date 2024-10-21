import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { RcSelect } from "../RcSelect";
import configureMockStore from "redux-mock-store";

const mockStore = configureMockStore()

describe("RcSelect", () => {
  it("renders with provided data", () => {
    const testData = {
        name: "selectName",
        text: "testText",
        events: [
          {
            "event": "onChange",
            "eventHandler": "handleChange"
          }
        ],
        options: [
          {
            "title": "Option1",
            "value": "option1"
          },
          {
            "title": "Option2",
            "value": "option2"
          }
        ]
    };

    const store = mockStore({
        applicationFormFieldsReducer: {
          applicationFormFieldsData: {
            territory: "My Territory",
          }
        },
        applicationFormReducer: {
          applicationFormData: {
            territory: "My User Territory",
          },
          applicationFormFieldError: {
            formFieldError: 'This is a required field',
          }
        },
          applicationHistoryReducer: {
            applicationHistoryData: []
        }
      })

    render(<Provider store={store}>
        <Router>
            <RcSelect {...testData} />
        </Router>
    </Provider>);

    expect(screen.getByText("testText")).toBeInTheDocument();
    expect(screen.getByText("Option1")).toBeInTheDocument();
  });
});