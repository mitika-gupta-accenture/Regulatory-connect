'use client';
import React from 'react';
import { GridRow, GridCol } from '@mhra/mhra-design-components';

interface DashboardTileProps {
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
  columnClassName?: string;
}

const DashboardTile: React.FC<DashboardTileProps> = ({
  title,
  description,
  linkText,
  linkHref,
  columnClassName = 'one-third',
}) => {
  return (
    <GridCol className={columnClassName + ' dashboard-tile'}>
      <div>
        <h2 className="govuk-heading-m">{title}</h2>
        <p className="govuk-body">{description}</p>
      </div>
      <div>
        <a className="govuk-link" href={linkHref}>
          {linkText}
        </a>
      </div>
    </GridCol>
  );
};

export default DashboardTile;
