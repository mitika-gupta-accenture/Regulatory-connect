import { render, screen, fireEvent } from "@testing-library/react";
import SkipLink from "../../../components/SkipLink";

describe('SkipLink', () => {
  it('renders skip link when tab is pressed', () => {
    const { getByTestId, queryByTestId } = render(<SkipLink />);
    expect(queryByTestId('skip-link')).toBeNull(); 

    fireEvent.keyDown(window, { key: 'Tab' });
    expect(getByTestId('skip-link')).toBeInTheDocument(); 
  });

  it('focuses on main content when skip link is clicked', () => {
    const { getByTestId } = render(<SkipLink />);
    fireEvent.keyDown(window, { key: 'Tab' });

    const mainContent = document.createElement('div');
    mainContent.id = 'main-content';
    document.body.appendChild(mainContent);

    const skipLink = getByTestId('skip-link');
    fireEvent.click(skipLink);

    expect(document.activeElement).toBe(mainContent);
  });
});