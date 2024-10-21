import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { PrevLink } from '../PrevLink';
import { useDispatch } from 'react-redux';
import "@testing-library/jest-dom";

// Mocking useTriggerEvents and useNavigation hooks
jest.mock('../../../core/hooks/useTriggerEvents', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    triggerEvent: jest.fn(),
  })),
}));

jest.mock("'../../../core/hooks/useNavigation", () => ({
  __esModule: true,
  default: () => ({
    previousPage: jest.fn(),
  })
}));

describe('PrevLink Component', () => {
  it('PrevLik renders correctly with classname', () => {
    const { getByText, container } = render(
      <PrevLink
        className="govuk-back-link"
        eventHandler={"previousPage"}
        text={"go to previous page"}
      />
    );
    expect(getByText('go to previous page')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('govuk-back-link');
  });

  it('PrevLik renders with default previous page event handler click without passing in props', () => {
    const { getByText } = render(
      <PrevLink
        text={"go to previous page"}
      />
    );
    fireEvent.click(getByText('go to previous page'));
  });

  it('triggers triggerEvent once when clicked in', () => {
    const triggerEventMock = jest.fn();
    jest.spyOn(require('../../../core/hooks/useTriggerEvents'), 'default').mockReturnValue({
      triggerEvent: triggerEventMock,
    });

    render(
      <PrevLink
        className="govuk-back-link"
        text="go to previous page"
      />
    );
    fireEvent.click(screen.getByText('go to previous page'));
    expect(triggerEventMock).toHaveBeenCalledTimes(1);
  });

  it('triggers triggerEvent when clicked with previousPage event handler', () => {
    render(<PrevLink className="govuk-back-link" text="go to previous page" />);

    fireEvent.click(screen.getByText('go to previous page'));

    expect(require("../../../core/hooks/useTriggerEvents").default().triggerEvent)
      .toHaveBeenCalledWith('previousPage');
  });
});