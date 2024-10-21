import React from "react";
import { render} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { SummaryList } from "../SummaryList";

describe("SummaryList", () => {
  it("should render the component with the correct text", () => {

    const { getByText } = render(<SummaryList />);
    const summaryListText = getByText(/Mason House/);

    expect(summaryListText).toBeInTheDocument();
  });
});