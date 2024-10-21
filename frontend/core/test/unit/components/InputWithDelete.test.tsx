import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import InputWithDelete from 'core/apis/add-another/InputWithDelete';

jest.mock('../../../../core/apis/add-another/actions', () => ({
    removeAnotherBehaviour: jest.fn(),
}));

describe('InputWithDelete Component', () => {
    const mockField: any = {
        identifier: 'plni-number-input',
        type: 'text',
        addMoreButtonText: 'Add another authorisation number',
        addMoreButtonType: 'secondary',
        validations: [[Object]],
        label: 'Enter authorisation number',
        errorMessage: 'please enter an authorisation number',
        size: 20,
        value: '',
        prefix: "",
        suffix: '',
        prefixValue: '',
        suffixValue: '',
        id: ''
    }
    const firstFieldID = 'plni-number-input';

    beforeEach(() => {
        jest.clearAllMocks();
    });



    it('correctly manipulates the aria-label attribute of the button', () => {
        render(<InputWithDelete field={mockField} firstFieldID={firstFieldID} />);

        const button = screen.getByRole('button', { name: /Delete authorisation number/i });
        expect(button).toHaveAttribute('aria-label', 'Delete authorisation number');
    });

    it('correctly cleans the label and uses it in VisuallyHidden', () => {
        render(<InputWithDelete field={mockField} firstFieldID={firstFieldID} />);

        // Check if VisuallyHidden component has the cleaned label
        expect(screen.getByText('authorisation number')).toBeInTheDocument();
    });


});
