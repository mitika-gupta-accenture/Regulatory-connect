import React from "react";
import { render} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { TextInput } from "../TextInput";

describe("TextInput", () => {
  it("should render the component with the correct text", () => {

    const testData = {
        displayOrder: 1,
        text: 'test label'
    }

    const { getByText } = render(<TextInput field={testData}/>);
    const summaryListText = getByText('test label');

    expect(summaryListText).toBeInTheDocument();
  });
});