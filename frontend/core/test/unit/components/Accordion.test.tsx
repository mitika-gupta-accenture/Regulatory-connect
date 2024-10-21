import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import AccordianWrapper, { AccordionFieldType } from '../../../components/Accordion';
import { Accordion as AccordionLib } from '@mhra/mhra-design-components';
 

jest.mock('@mhra/mhra-design-components', () => ({
  Accordion: jest.fn(() => <div>Accordion Mock</div>),
}));
 
describe('AccordianWrapper', () => {
  const field: AccordionFieldType = {
    type: 'accordion',
    identifier: 'change-of-legal-status-radios',
    id: 'accordion-id', 
    steps: [
      {
        id: 'step 1',
        title: 'step 1 title',
        summary: 'Summary of Step 1',
        content: 'Content for Step 1',
        defaultExpanded: true,
      },
      {
        id: 'step 2',
        title: 'step 2 title',
        summary: 'Summary of Step 2',
        content: 'Content for Step 2',
      },
    ],
  };
 
  it('renders the AccordionLib component', () => {
    render(<AccordianWrapper field={field} />);
 
    expect(screen.getByText('Accordion Mock')).toBeInTheDocument();
 
    
    expect(AccordionLib).toHaveBeenCalledWith(
      expect.objectContaining({
        steps: field.steps,
        id: field.id,
      }),
      {}
    );
  });
});