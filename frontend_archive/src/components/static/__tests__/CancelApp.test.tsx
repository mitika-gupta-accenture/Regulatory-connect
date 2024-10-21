import React from "react";
import { render } from "@testing-library/react";
import  {CancelApp} from "../CancelApp";
import {  BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";

jest.mock("react-redux", () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
  }));

describe("CancelApp component", () => {
    it("renders without crashing", () => {
        const { getByText } = render(
            <Router>
                <CancelApp/>
            </Router>
        );
        expect(getByText("Cancel your application")).toBeInTheDocument();
    });

});
