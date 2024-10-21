"use client";

import React from "react";
import {GridCol,GridRow, Heading, Paragraph} from '@mhra/mhra-design-components';

function Invalid() {
  return (
    <GridRow>
      <GridCol className='two-thirds'>
        <div id="main-content" data-testid="main-content">
          <Heading className="govuk-heading-l" text="You have started to complete the MHRA-base-form; you do not need to
            complete this form for this type of application." size="l" />
            <Paragraph text="You do not need to complete this form for this route." className="govuk-body" id=""/>
        </div>
      </GridCol>
    </GridRow>
  );
}

export default Invalid;
