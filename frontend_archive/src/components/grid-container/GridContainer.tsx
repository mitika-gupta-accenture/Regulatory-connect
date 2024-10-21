import React, { ReactNode } from 'react';

interface IGridContainerProps {
  children: ReactNode;
}

export const GridContainer = (props: IGridContainerProps) => {
  return (
    <React.Fragment>
      <div className='govuk-width-container app-width-container'>
        {props.children}
      </div>
    </React.Fragment>
  );
};
