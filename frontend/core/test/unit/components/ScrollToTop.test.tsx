import { render } from '@testing-library/react';
import ScrollToTop from '../../../components/ScrollToTop';

describe('ScrollToTop Component', () => {
    beforeEach(() => {

        window.scrollTo = jest.fn();
    });

    afterEach(() => {

        jest.clearAllMocks();
    });

    test('should scroll to top on mount', () => {
        render(<ScrollToTop />);


        expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });
});