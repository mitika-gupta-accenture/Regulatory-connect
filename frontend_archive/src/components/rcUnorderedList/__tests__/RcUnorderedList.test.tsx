import React from "react";
import { render, screen } from "@testing-library/react";
import { RcUnorderedList } from "../RcUnorderedList";
import { Provider } from "react-redux";
import "@testing-library/jest-dom";
import configureMockStore from "redux-mock-store";

const mockStore = configureMockStore();

describe("RcUnorderedList", () => {
  it("renders with provided data", () => {
    const store = mockStore({
      applicationFormFieldsReducer: {
        applicationFormFieldsData: {
          territory: "My Territory",
        },
      },
      applicationFormReducer: {
        applicationFormData: {
          territory: "My User Territory",
        },
      },
    });

    const testData = {
      name: "unorderedList",
      type: "unorderedlist",
      text: "My Unordered List",
      toolTip: "tooltip info",
      displayOrder: 3,
      disabled: false,
      visible: true,
      children: [
        {
          type: "listdata",
          text: "Your licence number is $$$",
          apiDataId: "territory",
        },
        {
          type: "",
          text: "Your licence number is @@@",
          linkData: {
            link: "https://www.google.com/",
            linkText: "Google",
          },
        },
      ],
    };

    render(
      <Provider store={store}>
        <RcUnorderedList {...testData} />
      </Provider>
    );

    // Add assertions based on component structure
    expect(screen.getByText("My Unordered List")).toBeInTheDocument();
    expect(
      screen.getByText("Your licence number is My Territory")
    ).toBeInTheDocument();
    expect(screen.getByText("Google")).toBeInTheDocument();
  });
});