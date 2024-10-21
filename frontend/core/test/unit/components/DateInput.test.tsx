
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import DateInput, { DateInputFieldType } from "../../../components/DateInput";

const field: DateInputFieldType = {
  "identifier": "application-date-input",
  "type": "date",
  "text": "Date of Birth",
  "id": "dateOfBirth",
  "fields": [
    {
      "identifier": "application-date-input--day",
      "name": "day",
      "value": "",
      "autoComplete": "off"
    },
    {
      "identifier": "application-date-input--month",
      "name": "month",
      "value": "",
      "autoComplete": "off"
    },
    {
      "identifier": "application-date-input--year",
      "name": "year",
      "value": "",
      "autoComplete": "off"
    }
  ],
  hint: undefined,
  inputs: null
};
const errorSummary = {
  title: 'Error summary title 1',
  errors: [],
};
describe("Details component", () => {

  test('renders the Checkbox component', () => {
    render(
      <DateInput field={field} errorSummary={errorSummary} previousAnswer={'2022-02-02'} />
    );
    expect(screen.getByText('Date of Birth')).toBeInTheDocument();
    expect(screen.getByLabelText('Day')).toBeInTheDocument();
    expect(screen.getByLabelText('Month')).toBeInTheDocument();
    expect(screen.getByLabelText('Year')).toBeInTheDocument();
  });


  it('renders fields using FieldFactory', () => {

    render(<DateInput field={field} errorSummary={errorSummary} />);
    const dayInput = screen.getByLabelText('Day');
    fireEvent.change(dayInput, { target: { value: '15' } });

    const monInput = screen.getByLabelText('Month');
    fireEvent.change(monInput, { target: { value: '10' } });

    const yearInput = screen.getByLabelText('Day');
    fireEvent.change(yearInput, { target: { value: '2020' } });


  });
});