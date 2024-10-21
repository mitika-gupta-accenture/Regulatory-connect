import React from "react";
import { H1, H2, H3 } from "govuk-react";
import useStringModifier from "../../core/hooks/useStringModifier";

export interface IRcLabelProps {
  className?: string;
  size?: string;
  name: string;
  text: string;
  apiDataId?: string;
}

export const RcLabel = React.memo(
  ({
    text,
    name,
    className = "",
    size = "M",
    apiDataId = "",
    ...restProps
  }: IRcLabelProps) => {
    const { getFinalString } = useStringModifier();
    const finalString = getFinalString(text, apiDataId);

    let Component: React.ElementType | null = null;
    if (finalString) {
      switch (size) {
        case "L":
          Component = H1;
          break;
        case "S":
          Component = H3;
          break;
        default:
          Component = H2;
          break;
      }
    }
    if (finalString) {
      switch (size) {
        case "L":
          Component = H1;
          break;
        case "S":
          Component = H3;
          break;
        default:
          Component = H2;
          break;
      }
    }

    return Component ? (
      <Component className={className} {...restProps}>
      {finalString}
    </Component>
  ) : <React.Fragment></React.Fragment>;
  }
);
