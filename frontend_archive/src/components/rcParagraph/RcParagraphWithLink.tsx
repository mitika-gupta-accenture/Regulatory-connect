import React, { useEffect, useState } from "react";
import useStringModifier from "../../core/hooks/useStringModifier";
import { RcLink } from "../rcLink/RcLink";
import { IEventConfigJsonProps } from "../../core/types/common";
import { NavigationCondition } from "../../core/hooks/useConditionEvaluator";

export interface IRcParagraphProps {
  text: string;
  displayOrder?: number;
  apiDataId?: string;
  visibilityCondition?: NavigationCondition<Record<string, any>>;
  name?: string
  disabled?: boolean
  className?: string
  events?: IEventConfigJsonProps[],
  navigationCondition?: string,
  styleBlue?: boolean
}

export const RcParagraphWithLink = React.memo(({
  text,
  displayOrder,
  name,
  navigationCondition,
  apiDataId = '',
  visibilityCondition = [],
  disabled = false,
  className = '',
  events = [],
  styleBlue = true,
  ...restProps
}: IRcParagraphProps) => {
  const [textBeforeLink, setTextBeforeLink] = useState("");
  const [textAfterLink, setTextAfterLink] = useState("");
  const [linkText, setLinkText] = useState("");

  const { getFinalString } = useStringModifier();

  useEffect(() => {
    const openBracketIndex = text.indexOf("[");
    const closeBracketIndex = text.indexOf("]");

    setTextBeforeLink(getFinalString(text.slice(0, openBracketIndex), apiDataId));
    setTextAfterLink(getFinalString(text.slice(closeBracketIndex + 1), apiDataId));
    setLinkText(getFinalString(text.slice(openBracketIndex + 1, closeBracketIndex), apiDataId));
  }, [text]);

  return (
    <p>{textBeforeLink} <RcLink navigationCondition={navigationCondition} className={className} events={events} name={name} children={[]} text={linkText}></RcLink> {textAfterLink}</p>
  );
});