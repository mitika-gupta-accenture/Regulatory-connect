import React from "react";
import { Button } from "govuk-react";
import useEventHandlers from "../../core/hooks/useEventHandlers";
import { IChildrenJsonProps, IEventConfigJsonProps, INestedChildrenJsonProps } from "../../core/types/common";
import {
  BUTTON_TEXT_COLOURS,
  BUTTON_THEMES,
} from "../../core/constants/buttonTypes";

export interface IRcButtonProps {
  theme?: string;
  eventHandler?: string;
  className?: string;
  disabled?: boolean;
  name: string;
  events?: IEventConfigJsonProps[];
  text: string;
  size?: string;
  type?: string;
  navigationCondition?: Record<string, any> | string;
  onClick?: (e: Event) => any;
  requiredComponents?: (IChildrenJsonProps | INestedChildrenJsonProps)[];
  specialFlowCondition?: Record<string, any> | any;
}

export const RcButton = React.memo(
  ({
    theme = "",
    eventHandler = "",
    className = "",
    disabled = false,
    name,
    events = [],
    text,
    size = "",
    type,
    navigationCondition = "",
    specialFlowCondition = "",
    onClick = () => {},
    requiredComponents = [],
    ...restProps
  }: IRcButtonProps) => {
    const { bindEventHandlers } = useEventHandlers();
    const themeMapping: any = {
      secondary: {
        buttonColour: BUTTON_THEMES.SECONDARY,
        buttonTextColour: BUTTON_TEXT_COLOURS.SECONDARY,
      },
      warning: {
        buttonColour: BUTTON_THEMES.WARNING,
      },
    };

    const buttonTheme = theme && themeMapping[theme];

    return (
      <Button
        type={eventHandler && type === "button" ? eventHandler : "submit"}
        className={`govuk-button ${className ? className : ""}`}
        disabled={disabled}
        {...buttonTheme}
        name={name}
        {...(events !== undefined && {
          ...bindEventHandlers(events, onClick, navigationCondition, '',requiredComponents, specialFlowCondition),
        })}
        start={size === "medium"}
      >
        {text}
      </Button>
    );
  }
);
