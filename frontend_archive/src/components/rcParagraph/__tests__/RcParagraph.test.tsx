import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import "@testing-library/jest-dom";
import mockStore from "../../../core/store/mockStore";
import { RcParagraph } from "../RcParagraph";


describe("RcParagraph", () => {
  it("renders with provided data", () => {
    const testData = {
      name: "ParagraphName",
      text: "test paragraph",
    };

    const { getByText } = render(
      <Provider store={mockStore}>
        <RcParagraph {...testData} />
      </Provider>
    );
    
    const testLabel = getByText("test paragraph")
    
    expect(testLabel).toBeInTheDocument();
  });
});