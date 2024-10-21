import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import Element from "../Element";
import mockStore from "../../../core/store/mockStore";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

describe("Element component", () => {
  it("renders p tag when field is undefined", () => {
    const elem = {
      type: "",
    };
    const { getByText } = render(
      <Provider store={mockStore}>
        <Router>
          <Element field={elem} />
        </Router>
      </Provider>
    );

    const errorParagraph = getByText("field type: '' is not defined");
    expect(errorParagraph).toBeInTheDocument();
  });

  it("returns null when visibility condition is false", () => {
    const elem = {
      type: "",
      visible: false,
    };

    const { container } = render(
      <Provider store={mockStore}>
        <Router>
          <Element field={elem} />
        </Router>
      </Provider>
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders paragraph with expected text", () => {
    const elem = {
      type: "button",
      text: "test",
      name: "button",
    };
    const { getByText } = render(
      <Provider store={mockStore}>
        <Router>
          <Element field={elem} />
        </Router>
      </Provider>
    );

    const testButton = getByText("test");
    expect(testButton).toBeInTheDocument();
  });
  it("renders link with expected text", () => {
    const elem = {
      type: "link",
      text: "testlink",
      name: "link",
    };
    const { getByText } = render(
      <Provider store={mockStore}>
        <Router>
          <Element field={elem} />
        </Router>
      </Provider>
    );

    const testButton = getByText("testlink");
    expect(testButton).toBeInTheDocument();
  });
});
