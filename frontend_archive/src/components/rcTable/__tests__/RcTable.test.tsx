import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import "@testing-library/jest-dom";
import mockStore from "../../../core/store/mockStore";
import { RcTable } from "../RcTable";


describe("RcTable", () => {
  it("renders with provided data", () => {
    const testData = {
        text: "test table",   
        children: [{
          type: 'tableHeader',
          columns: [['tableHeader1']],
          displayOrder: 1
        }, {
          type: 'tableBody',
          rows: [['tableBody1']],
          displayOrder: 1
        }]
    };

    const { getByText } = render(
      <Provider store={mockStore}>
        <RcTable {...testData} />
      </Provider>
    );
    
    const testTableCaption = getByText("test table")
    const tableBody = getByText('tableBody1')
    const tableHeader = getByText('tableBody1')
    
    expect(testTableCaption).toBeInTheDocument();
    expect(tableBody).toBeInTheDocument();
    expect(tableHeader).toBeInTheDocument();
  });
});