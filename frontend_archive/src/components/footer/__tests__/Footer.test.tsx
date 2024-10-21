import React from "react";
import { render } from "@testing-library/react";
import { RcFooter } from "../Footer";

it("Footer component rendered", () => {
  render(<RcFooter />);

  expect(<RcFooter />).toBeDefined();
});