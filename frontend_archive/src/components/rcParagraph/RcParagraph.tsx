import React from "react";
import { Paragraph } from "govuk-react";
import useStringModifier from "../../core/hooks/useStringModifier";
import { NavigationCondition } from "../../core/hooks/useConditionEvaluator";

export interface IRcParagraphProps {
  text: string;
  displayOrder?: number;
  apiDataId?: string;
  visibilityCondition?: NavigationCondition<Record<string, any>>;
  className?: string;
  isBold?: boolean;
}

export const RcParagraph = React.memo(({ text, displayOrder, apiDataId = '', visibilityCondition = [], className = '', isBold = false }: IRcParagraphProps) => {
  const { getFinalString } = useStringModifier();
  const finalString = getFinalString(text, apiDataId);

  return (
    (finalString && finalString !== '') ? (
      <Paragraph className={className}>{`${isBold ? '**' + finalString + '**' : finalString}`}</Paragraph>
    ) : <React.Fragment></React.Fragment>
  );
});
