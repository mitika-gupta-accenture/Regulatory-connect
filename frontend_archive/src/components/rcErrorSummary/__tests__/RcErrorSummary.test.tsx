import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // For additional matchers
import { RcErrorSummary } from '../RcErrorSummary';
import { useDispatch } from 'react-redux';

jest.mock('react-redux', () => ({
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
// Mock document.querySelectorAll and document.documentElement.scrollIntoView
document.querySelectorAll = jest.fn(() => ({
    0: {
        scrollIntoView: jest.fn(), // Mocking scrollIntoView function
    },
    length: 1,
})) as unknown as jest.Mock;

document.documentElement.scrollIntoView = jest.fn();

describe('RcErrorSummary', () => {

    const mockDispatch = jest.fn();
    const formFieldErrors = { territory: "please enter territory", selectTerritory: "please select teritory", datefield: "Please enter Day, Month, Year" };
    const showErrors = true;
    const applicationFormFieldsData = {
        territory: [{ name: "selectTerritory1" }],
        applicationFormFieldError: {
            formFieldErr: "",
            validateField: "",
        },
    };
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    jest.spyOn(require('../../../core/hooks/customSelectors'), 'formErrDataSelector').mockReturnValue({ formFieldErrors, showErrors });
    jest.spyOn(require('../../../core/hooks/customSelectors'), 'formFieldsDataSelector').mockReturnValue(applicationFormFieldsData);
    // Mock props

    const requiredComponents = [
        { name: "territory", type: "input", required: true },
        {
            name: "datefield", type: "dateField", inputNames: [{
                day: "",
                month: "",
                year: ""
            }], required: true
        },
        { name: "selectTerritory", type: "AddMore", required: true }
    ];

    it('renders with errors but without matching component name with add more type field', () => {
        const { getByText } = render(<RcErrorSummary requiredComponents={requiredComponents} />);
        expect(getByText("please enter territory")).toBeInTheDocument();
        expect(getByText("please select teritory")).toBeInTheDocument();
        expect(getByText("Please enter Day, Month, Year")).toBeInTheDocument();
    });

    it('renders with errors but without matching component name with add more type field', () => {
        const formFieldErrors = { selectTerritory1: "please select selectTeritory1", };
        (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
        jest.spyOn(require('../../../core/hooks/customSelectors'), 'formErrDataSelector').mockReturnValue({ formFieldErrors, showErrors });
        jest.spyOn(require('../../../core/hooks/customSelectors'), 'formFieldsDataSelector').mockReturnValue(applicationFormFieldsData);
        const requiredComponents = [
            { name: "territory", type: "AddMore", required: true }
        ];
        const { getByText } = render(<RcErrorSummary requiredComponents={requiredComponents} />);
        expect(getByText("please select selectTeritory1")).toBeInTheDocument();

        fireEvent.click(getByText("please select selectTeritory1"));

        // Assert that document.querySelectorAll was called with the correct parameter
        expect(document.querySelectorAll).toHaveBeenCalledWith(`[name^="selectTerritory1"]`);
    });
});
