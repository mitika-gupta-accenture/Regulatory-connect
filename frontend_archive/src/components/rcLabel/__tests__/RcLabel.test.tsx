import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import "@testing-library/jest-dom";
import mockStore from "../../../core/store/mockStore";
import { RcLabel } from "../RcLabel";

describe("RcLabel", () => {
  it("renders with provided data", () => {
    const testData = {
      name: "labelName",
      text: "test label",
    };

    const { getByText } = render(
      <Provider store={mockStore}>
        <RcLabel {...testData} />
      </Provider>
    );
    
    const testLabel = getByText("test label")
    
    expect(testLabel).toBeInTheDocument();
  });
});