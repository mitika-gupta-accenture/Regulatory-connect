import React from "react";
import { Link } from "govuk-react";
import Element from "../element/Element";
import useEventHandlers from "../../core/hooks/useEventHandlers";
import useStringModifier from "../../core/hooks/useStringModifier";
import { IEventConfigJsonProps } from "../../core/types/common";

export interface IRcLinkProps {
  name?: string;
  text: string;
  disabled?: boolean;
  className?: string;
  apiDataId?: string;
  apiDataIdKeys?: string[];
  layout?: string;
  href?: string;
  events?: IEventConfigJsonProps[];
  children?: any[];
  navigationCondition?: string;
  styleBlue?: boolean;
}

export const RcLink = React.memo(
  ({
    name,
    text,
    navigationCondition,
    disabled = false,
    className = "",
    apiDataId = "",
    apiDataIdKeys = [],
    layout = "",
    href = "",
    events = [],
    children = [],
    styleBlue = true,
    ...props
  }: IRcLinkProps) => {
    const { resolveNestedkeys } = useStringModifier();
    const { bindEventHandlers } = useEventHandlers();
    
    const links =
      (apiDataId && apiDataId !== "" && resolveNestedkeys(apiDataId)) || text;
      
    switch (true) {
      case Array.isArray(links):
        const linkElements = links.map((link: any) => {
          const [textKey = text, hrefKey = href] = apiDataIdKeys ?? [];
          const elem = {
            ...props,
            text: link[textKey],
            href: link[hrefKey],
            apiDataId: "",
            type: "link"
          };

          return (
            <Element
              field={elem}
              key={elem.text}
              customClassName={`govuk-!-margin-top-2 govuk-!-margin-bottom-2 ${className}`}
              layout={layout}
            />
          );
        });
        return <>{linkElements}</>;

      case typeof links === "string":
        return (
          <Link
            className={`${className ? className : ""}`}
            disabled={disabled}
            name={name}
            id={name}
            {...(events !== undefined && {
              ...bindEventHandlers(events, () => ({}), navigationCondition),
            })}
            {...(href && { ...{ href: `https://${href}`} })}
            style={styleBlue && { color: "#1d70b8", cursor: "pointer" }}
          >
            {links}
          </Link>
        );

      default:
        const elem = {
          ...props,
          text: apiDataIdKeys ? links[apiDataIdKeys[0]] || text : text,
          href: apiDataIdKeys ? links[apiDataIdKeys[1]] || href : href,
          apiDataId: "",
          type: "link"
        };
        return <Element field={elem} key={0}  customClassName={`${className}`} />;
    }
  }
);