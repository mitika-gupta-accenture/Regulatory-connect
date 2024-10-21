import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { RcButton } from "../RcButton";
import "@testing-library/jest-dom";
import useEventHandlers from "../../../core/hooks/useEventHandlers";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import mockStore from "../../../core/store/mockStore";

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn().mockImplementation(selector => selector()),
}));

jest.mock("../../../core/hooks/useNavigation", () => ({
  __esModule: true,
  default: () => ({
    nextPage: jest.fn(),
    previousPage: jest.fn(),
  })
}));

jest.mock("../../../core/hooks/useEventHandlers", () => ({
  __esModule: true,
  default: jest.fn(),
}));


describe("RcButton Component", () => {

  const mockBindEventHandlers = jest.fn();
  (useEventHandlers as unknown as jest.Mock).mockReturnValue({ bindEventHandlers: mockBindEventHandlers });

  it("renders button correctly with provided props", () => {
    const testData = {
      "name": "cancelAppButton",
      "type": "button",
      "text": "Cancel application",
      "toolTip": "",
      "displayOrder": 4,
      "children": [],
      "visible": true,
      "navigationCondition": "TailorYourApp"
    };

    const { getByText } = render(
      <Provider store={mockStore}>
        <Router>
          <RcButton {...testData} />
        </Router>
      </Provider>
    );

    const button = getByText("Cancel application");
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("govuk-button");
  });

  it("disables button when disabled prop is true", () => {
    render(
      <RcButton
        theme="secondary"
        className="test-button"
        disabled={true}
        name="cancelAppButton"
        text="Cancel application"
      />
    );

    const button = screen.getByText("Cancel application");
    expect(button).toBeDisabled();
  });


  it("calls handleOnClick when button is clicked", () => {
    const handleOnClick = jest.fn();
    (useEventHandlers as jest.Mock).mockReturnValue({
      bindEventHandlers: jest.fn().mockReturnValue({
        onClick: handleOnClick,
      }),
    });

    // Render RcButton with mock props
    render(
      <RcButton
        theme="secondary"
        className="test-button"
        disabled={false}
        name="cancelAppButton"
        text="Cancel application"
        eventHandler="handleOnClick"
        type="button"
        onClick={handleOnClick}
        requiredComponents={[]}
        size="M"
        events={[
          {
            event: "onClick",
            eventHandler: "handleOnClick",
          },
        ]}
      />
    );

    fireEvent.click(screen.getByText("Cancel application"));
    expect(handleOnClick).toHaveBeenCalled();
  });

  it("calls handleOnClick (AddMore) when button is clicked", () => {
    const handleOnClick = jest.fn();
    (useEventHandlers as jest.Mock).mockReturnValue({
      bindEventHandlers: jest.fn().mockReturnValue({
        onClick: handleOnClick,
      }),
    });

    // Render RcButton with mock props
    render(
      <RcButton
        name={'AddmoreButton'}
        className="govuk-body govuk-!-margin-bottom-9"
        text={'Add More'}
        theme="secondary"
        events={[
          {
            event: "onClick",
            eventHandler: "handleOnClick",
          },
        ]}

      />
    );

    fireEvent.click(screen.getByText("Add More"));
    expect(handleOnClick).toHaveBeenCalled();
    // console.log(handleOnClick);
    // expect(handleOnClick).toHaveBeenCalledWith(
    //   expect.objectContaining({
    //     onClick: () => {},
    //   })
    // );
  });


  it("calls handleAPICall when input value changes", () => {
    const handleConditionalNavigation = jest.fn();
    (useEventHandlers as jest.Mock).mockReturnValue({
      bindEventHandlers: jest.fn().mockReturnValue({
        onClick: handleConditionalNavigation,
      }),
    });

    render(
      <RcButton
        theme="secondary"
        className="test-button"
        disabled={false}
        name="cancelAppButton"
        text="Cancel application"
        navigationCondition="TailorYourApp"
        requiredComponents={[]}
        events={[
          {
            "event": "onClick",
            "eventHandler": "handleConditionalNavigation"
          }
        ]}
      />
    );

    fireEvent.click(screen.getByText("Cancel application"));
    expect(handleConditionalNavigation).toHaveBeenCalled();
  });

  it("renders button with default onClick function", () => {
    const testData = {
      name: "testButton",
      text: "Test Button",
    };

    render(
      <RcButton {...testData} />
    );

    const button = screen.getByText("Test Button");
    fireEvent.click(button);
  });
});
