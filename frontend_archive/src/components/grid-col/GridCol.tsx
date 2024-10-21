import React, { ReactNode } from 'react';

interface IGridColProps {
  key?: number;
  className: string;
  children?: ReactNode;
}

export const GridCol = (props: IGridColProps) => {

  return (
    <>
      <div className={`govuk-grid-column-${props.className}`}>
        {props.children}
      </div>
    </>
  );
};
