import React from "react";
import { render, screen } from "@testing-library/react";
import Tabs, { TabsFieldType } from "../../../components/Tabs";
 
describe("Tabs component", () => {
  const mockTab: TabsFieldType = {
    type: "tabs",
    tabs: [
      {
        heading: "Tab 1",
        content: ["content line 1", "content line 2"],
      },
      {
        heading: "Tab 2",
        content: ["Test content", "Test content 2"],
      },
    ],
  };
 
  const errorSummary = {
    title: 'Error summary title 1',
    errors: [],
  };
 
  it("renders tabs with correct headings", () => {
    render(<Tabs field={mockTab} errorSummary={errorSummary} />);

    mockTab.tabs.forEach((tab) => {
      expect(screen.getByRole('link', { name: tab.heading })).toBeInTheDocument();
    });
  });
 
  it("renders the tab content correctly", () => {
    render(<Tabs field={mockTab} errorSummary={errorSummary}/>);
 
    mockTab.tabs.forEach((tab) => {
      tab.content.forEach((line, index) => {
        expect(screen.getByTestId(`tab-content-${index}-${tab.heading}`)).toBeInTheDocument();
      });
    });
  });
});