import React, { ReactNode } from 'react';

interface IGridWrapperProps {
  children: ReactNode;
}

export const GridWrapper = (props: IGridWrapperProps) => {

  return (
    <React.Fragment>
      <div className='govuk-main-wrapper'>
        {props.children}
      </div>
    </React.Fragment>
  );
};
