'use client';
import React from 'react';
import { Accordion as AccordionLib } from '@mhra/mhra-design-components';
import { AccordionProps } from '@mhra/mhra-design-components/dist/components/accordion/accordion.types';
export interface AccordionFieldType extends AccordionProps {
  type: 'accordion';
  identifier: string;
  name?: string;
  addMoreButtonText?: string;
  addMoreButtonType?: string;
  label?: string;
  apiDataKey?: string;
  showChangeLinkInSummary?: boolean;
}

export default function AccordianWrapper({
  field,
}: {
  field: AccordionFieldType;
  previousAnswer?: string;
}) {
  return <AccordionLib steps={field.steps} id={field.id} />;
}
