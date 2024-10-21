import React from "react";
import { render } from "@testing-library/react";
import { Header } from "../Header";

it("Header component rendered", () => {
  render(<Header />);

  expect(<Header />).toBeDefined();
});