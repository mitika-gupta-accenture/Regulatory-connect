import React, { ReactNode } from 'react';

interface IGridRowProps {
  children: ReactNode;
}

export const GridRow = (props: IGridRowProps) => {
  return (
    <>
      <div className='govuk-grid-row'>
        {props.children}
      </div>
    </>
  );
};
