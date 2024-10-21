import React from "react";
import { Details } from "govuk-react";
import Element from "../element/Element";
import { GridCol } from "../grid-col/GridCol";
import {
  IChildrenJsonProps,
  IEventConfigJsonProps,
} from "../../core/types/common";

export interface IRCDetailsProps {
  name: string;
  type?: string;
  text?: string;
  toolTip?: string;
  displayOrder: number;
  disabled?: boolean;
  visible?: boolean;
  size?: string;
  events?: IEventConfigJsonProps[];
  value?: string;
  style?: Object;
  children?: IChildrenJsonProps[];
  className?: string;
  summary?: string;
  detailsText?: string;
  open?: boolean;
}

export const RcDetails = React.memo(
  ({
    name = "",
    type = "hintlabel",
    text = "",
    toolTip = "",
    displayOrder,
    disabled = false,
    visible = true,
    size = "M",
    events = [],
    value = "",
    style = {},
    children = [],
    className = "",
    summary = "",
    detailsText = "",
    open = false,
    ...restProps
  }: IRCDetailsProps) => {
    return (
      <Details open={open} summary={text}>
        {(detailsText || (children && children.length > 0)) && (
          <React.Fragment>
            {detailsText && <GridCol className="full">{detailsText}</GridCol>}
            {children && children.length > 0 && (
              <GridCol className="two-third">
                {children.map((elem: IChildrenJsonProps, index: number) => (
                  <Element
                    key={elem.displayOrder}
                    field={elem}
                    renderGridCol={false}
                  />
                ))}
              </GridCol>
            )}
          </React.Fragment>
        )}
      </Details>
    );
  }
);
