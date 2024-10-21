import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { RcRadio } from "../RcRadio";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import * as Redux from "react-redux";

import { mockFormData, mockFormFieldsData } from "../../../core/store/mockState";

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn().mockImplementation(selector => selector()),
}));


jest.mock("../../../core/hooks/useNavigation", () => ({
  __esModule: true,
  default: () => ({
    nextPage:  jest.fn(),
    previousPage: jest.fn(),
  })
}));

beforeEach(() => {
  (Redux.useSelector as unknown as jest.Mock)

    .mockReturnValue({})
    .mockReturnValueOnce(mockFormData)
    .mockReturnValueOnce(mockFormFieldsData);

});
describe("RcRadio", () => {
  const mockOnChange = jest.fn();
  const title = "Test Radio";
  const value = "test_value";
  const selectedValue = "test_value";
  const hint = "Test Hint";
  const parentName = "test_parent";
  const apiDataId = "test_api_data_id";
 
 
  it("renders radio input correctly", () => {
    const { getByLabelText } = render(
      <RcRadio
        title={title}
        value={value}
        selectedValue={selectedValue}
        onChange={mockOnChange}
        parentName={parentName}
        apiDataId={apiDataId}
      />
    );
    const radioInput = getByLabelText(title);
    expect(radioInput).toBeInTheDocument();
    expect(radioInput).toHaveAttribute("name", parentName);
    expect(radioInput).toHaveAttribute("id", value);
    expect(radioInput).toHaveAttribute("value", value);
    expect(radioInput).toHaveAttribute("checked", selectedValue === value ? "" : null);
  });
  it("renders hint text correctly", () => {
    const { getByText } = render(
<RcRadio
        title={title}
        value={value}
        selectedValue={selectedValue}
        hint={hint}
      />
    );
    const hintElement = getByText("Test Hint");
    expect(hintElement).toBeInTheDocument();
  });
  it("renders with custom size", () => {
    const { getByLabelText } = render(
      <RcRadio
        title={title}
        value={value}
        selectedValue={selectedValue}
        size="SMALL"
      />
    );
    const radioInput = getByLabelText(title);
    expect(radioInput).toHaveStyle("width: 36px; height: 36px;");
  });
  it("renders with no hint text when hint prop is not provided", () => {
    const { queryByText } = render(
      <RcRadio
        title={title}
        value={value}
        selectedValue={selectedValue}
      />
    );
    const hintElement = queryByText(hint);
    expect(hintElement).not.toBeInTheDocument();
  });
  test('calls onChange when radio button is clicked', () => {
    const handleChange = jest.fn();
    const { getByLabelText } = render(
      <RcRadio title="Test" value="test" onChange={handleChange} />
    );
    fireEvent.click(getByLabelText('Test'));
    expect(handleChange).toHaveBeenCalled();
  });

  test('does not throw error when onChange handler is not provided', () => {
    const { getByLabelText } = render(<RcRadio title="Test" />);
    const radioButton = getByLabelText('Test');
    fireEvent.click(radioButton); 
  });
  test("does not throw error when onChange handler is not provided", () => {
    const { getByLabelText } = render(<RcRadio title="Test" />);
    const radioButton = getByLabelText('Test');
    fireEvent.change(radioButton, { target: { value: "test" } }); 
  });
});

test('does not render children when children prop is not provided', () => {
  const { queryByTestId } = render(<RcRadio title="Test" />);
  expect(queryByTestId('conditional-container')).toBeNull();
});
it("renders with disabled attribute when disabled prop is true", () => {
  const { container } = render(
    <RcRadio title="Test Radio" value="option1" disabled />
  );
  const radioInput = container.querySelector("input[type=radio]");
  expect(radioInput).toBeDisabled();
});




it('renders conditional children when selectedValue matches value and children exist', () => {
  const mockChildren = [
    { name: "child1", value: "value1",text:"child1",type:"hintlabel", displayOrder: 1 },
    { name: "child2", value: "value2",text:"child2",type:"hintlabel", displayOrder: 2 },
  ];
  
  const props = {
    selectedValue: 'someValue',
    value: 'someValue',
    children: mockChildren,
    title:'Test Radio'
  };
  (Redux.useSelector as unknown as jest.Mock).mockReturnValue(props);

  
  const { getByText } = render(<RcRadio {...props} />);

  
  mockChildren.forEach(child => {
    const childElement = getByText(child.name); 
    expect(childElement).toBeInTheDocument();
  });
});

it("applies inline styles when inline prop is true", () => {
  const { getByLabelText } = render(<RcRadio title="Test Radio" value="Test_value" inline />);
  const radio = getByLabelText("Test Radio");
  expect(radio).toHaveStyle({
    top: "-1px",
    left: "-3px",
    width: "36px"
}); 




});





