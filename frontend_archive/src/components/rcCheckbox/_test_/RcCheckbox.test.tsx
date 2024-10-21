import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { IRcCheckboxProps, RcCheckbox } from '../RcCheckbox'; 
import { useDispatch, useSelector } from 'react-redux';
import { mockFormData, mockFormFieldsData, mockState } from "../../../core/store/mockState";
import { formDataSelector } from "../../../core/hooks/customSelectors";

jest.mock('../../../core/hooks/useStringModifier', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    getFinalString: jest.fn().mockReturnValue('Test Title'),
  }),
}));

jest.mock("../../../core/hooks/useNavigation", () => ({
  __esModule: true,
  default: () => ({
    nextPage:  jest.fn(),
    previousPage: jest.fn(),
  })
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn().mockImplementation(selector => selector()),
}));

describe('RcCheckbox Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useSelector as unknown as jest.Mock)
    .mockReturnValue({})
    .mockReturnValueOnce(mockFormData)
    .mockReturnValueOnce(mockFormFieldsData);
  });
  
  it('renders RcCheckbox component with provided data', () => {
    const testData = {
      text: 'Checkbox Text',
      name: 'checkboxName',
      title: 'Title',
      value: 'checkboxValue',
    };

    render(<RcCheckbox {...testData} />);
    expect(screen.getByLabelText('Test Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Test Title')).not.toBeChecked();
  });

  it('triggers onClick event when clicked', () => {
    const onClickMock = jest.fn();
    const testData = {
      text: 'Checkbox Text',
      name: 'checkboxName',
      title: 'Title',
      value: 'checkboxValue',
      onClick: onClickMock,
    };

    render(<RcCheckbox {...testData} />);
    fireEvent.click(screen.getByLabelText('Test Title'));
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('triggers onChange event when checkbox value changes', () => {
    const onChangeMock = jest.fn();
    const testData = {
      text: 'Checkbox Text',
      name: 'checkboxName',
      title: 'Title',
      value: 'checkboxValue',
      onChange: onChangeMock,
    };

    render(<RcCheckbox {...testData} />);
    fireEvent.click(screen.getByLabelText('Test Title'));
    expect(onChangeMock).toHaveBeenCalledTimes(1);
  });  

  it('renders RcCheckbox component with checked state if selectedValue includes value', () => {
    const testData = {
      text: 'Checkbox Text',
      name: 'checkboxName',
      title: 'Title',
      value: 'checkboxValue',
      selectedValue: ['checkboxValue'],
    };

    render(<RcCheckbox {...testData} />);
    expect(screen.getByLabelText('Test Title')).toBeChecked();
  });

  it('renders RcCheckbox component with disabled state if disabled prop is true', () => {
    const testData = {
      text: 'Checkbox Text',
      name: 'checkboxName',
      title: 'Title',
      value: 'checkboxValue',
      disabled: true,
    };

    render(<RcCheckbox {...testData} />);
    expect(screen.getByLabelText('Test Title')).toBeDisabled();
  });

  it('renders RcCheckbox component with inline style if inline prop is true', () => {
    const testData = {
      text: 'Checkbox Text',
      name: 'checkboxName',
      title: 'Title',
      value: 'checkboxValue',
      inline: true,
    };

    render(<RcCheckbox {...testData} />);
    const checkbox = screen.getByLabelText('Test Title');
    expect(checkbox).toHaveStyle('display: inline-block;');
  });

  it('renders RcCheckbox component with hint text if hint prop is provided', () => {
    const testData = {
      text: 'Checkbox Text',
      name: 'checkboxName',
      title: 'Title',
      value: 'checkboxValue',
      hint: 'This is a hint text',
    };

    render(<RcCheckbox {...testData} />);
    expect(screen.getByText('This is a hint text')).toBeInTheDocument();
  });

  it('renders with default props if no props are provided', () => {
    render(<RcCheckbox text={''} name={undefined} title={''} />);
    expect(screen.queryByText('Child Element')).not.toBeInTheDocument();
  });
  
  it('does not throw an error when onClick prop is not provided', () => {
    const testData = {
      text: 'Checkbox Text',
      name: 'checkboxName',
      title: 'Title',
      value: 'checkboxValue',
    };
  
    render(<RcCheckbox {...testData} />);
    expect(() => fireEvent.click(screen.getByTestId('checkbox-input'))).not.toThrow();
  });

  it('renders RcCheckbox component with provided apiDataId', () => {
    const testData: IRcCheckboxProps = {
      text: 'Checkbox Text',
      name: 'checkboxName',
      title: 'Title',
      value: 'checkboxValue',
      apiDataId: '12345',
    };

    render(<RcCheckbox {...testData} />);
    const checkbox = screen.getByTestId('checkbox-input'); 
  });

  it('renders RcCheckbox component with size variant set to "MEDIUM"', () => {
    const testData = {
      text: 'Checkbox Text',
      name: 'checkboxName',
      title: 'Title',
      value: 'checkboxValue',
      size: 'MEDIUM' as const, 
    };
    render(<RcCheckbox {...testData} />);
    const checkbox = screen.getByTestId('checkbox-input');
    expect(checkbox).toHaveStyle('width: 36px');
    expect(checkbox).toHaveStyle('height: 36px');
  });

  it('triggers onChange event when checkbox value changes without selectedValue', () => {
    const onChangeMock = jest.fn();
    const testData = {
      text: 'Checkbox Text',
      name: 'checkboxName',
      title: 'Title',
      value: 'checkboxValue',
      onChange: onChangeMock,
    };
  
    render(<RcCheckbox {...testData} />);
    fireEvent.click(screen.getByLabelText('Test Title'));
    expect(onChangeMock).toHaveBeenCalledTimes(1);
  });
  
  it('does not throw an error when onClick prop is not provided', () => {
    const testData = {
      text: 'Checkbox Text',
      name: 'checkboxName',
      title: 'Title',
      value: 'checkboxValue',
    };
  
    render(<RcCheckbox {...testData} />);
    expect(() => fireEvent.click(screen.getByTestId('checkbox-input'))).not.toThrow();
  });
  
  it('renders tooltip if toolTip prop is provided', () => {
    const testData = {
      text: 'Checkbox Text',
      name: 'checkboxName',
      title: 'Title',
      value: 'checkboxValue',
      toolTip: 'This is a tooltip',
    };
  
    render(<RcCheckbox {...testData} />);
    expect(screen.getByTestId('checkbox-input')).toHaveAttribute('title', 'This is a tooltip');
  });

  it('renders conditional children mapping function when checkbox is checked', async () => {
    const childrenData = [
      {  title: 'Title1',text: 'Child Element 1', type: 'hintlabel', displayOrder: 1 },
      {  title: 'Title2',text: 'Child Element 2', type: 'hintlabel', displayOrder: 2 },
    ]

    const field: IRcCheckboxProps = {
      text: 'Checkbox Text',
      name: 'checkboxName',
      title: 'Title',
      value: 'checkboxValue',
      selectedValue: ['checkboxValue'], 
      children: childrenData
    };
    const mockDispatch = jest.fn();
  (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
  (useSelector as unknown as jest.Mock).mockReturnValueOnce(formDataSelector(mockState))
    const { getByText } = render(<RcCheckbox  {...field} />);
    childrenData.forEach((child) => {
      const childText = getByText(child.text.toString());
      expect(childText).toBeInTheDocument();
    });
  
  });
});
