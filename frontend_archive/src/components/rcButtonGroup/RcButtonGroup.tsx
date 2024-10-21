import React from "react";
import { RcLabelWithCaption } from "../rcLabelWithCaption/RcLabelWithCaption";
import { IRcButtonProps, RcButton } from "../rcButton/RcButton";
import { INestedChildrenJsonProps } from "../../core/types/common";

export interface IRcButtonGroupProps {
  children?: INestedChildrenJsonProps[];
  visible?: boolean;
  text: string;
}

export const RcButtonGroup = React.memo(
  ({ children, visible = true, text }: IRcButtonGroupProps) => {
    return visible ? (
      <div className="govuk-button-group">
        {text && <RcLabelWithCaption text={text} />}
        {children &&
          children.map((child: INestedChildrenJsonProps, index: number) => {
            return (
              child.visible && (
                <RcButton
                  {...(child as IRcButtonProps)}
                  key={child.apiDataId}
                />
              )
            );
          })}
      </div>
    ) : (
      <React.Fragment></React.Fragment>
    );
  }
);
