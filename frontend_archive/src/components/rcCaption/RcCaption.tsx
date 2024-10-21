import React from "react";
import { Caption } from "govuk-react";
import useStringModifier from '../../core/hooks/useStringModifier';

export interface IRcCaptionProps {
  text: string;
  className?: string;
  size?: string;
  name: string;
  apiDataId?: string;
}

export const RcCaption = React.memo(({
  text,
  name,
  className = '',
  size = 'L',
  apiDataId = '',
  ...restProps
}: IRcCaptionProps) => {
  const { getFinalString } = useStringModifier();
  const finalString = getFinalString(text, apiDataId);
  return (
    finalString ? (
      <Caption
        className={className}
        size={size}
        id={`caption-${name}`}
        name={`caption-${name}`}
      >
        {finalString}
      </Caption>
    ) : <React.Fragment></React.Fragment>
  );
});
