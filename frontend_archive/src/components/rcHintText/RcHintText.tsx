import React from "react";
import { HintText } from "govuk-react";
import useStringModifier from "../../core/hooks/useStringModifier";

export interface IRcHintTextProps {
  text: string;
  displayOrder?: number;
  apiDataId?: string;
  className?: string;
}

export const RcHintText = React.memo(
  ({ text, apiDataId = "", className = "" }: IRcHintTextProps) => {
    const { getFinalString } = useStringModifier();
    const finalString = getFinalString(text, apiDataId);

    return finalString && finalString !== "" ? (
      <HintText className={className}>{finalString}</HintText>
    ) : (
      <React.Fragment></React.Fragment>
    );
  }
);
