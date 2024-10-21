import React from "react";
import { Checkbox } from "govuk-react";
import Element from "../element/Element";
import { RcParagraph } from "../rcParagraph/RcParagraph";
import useStringModifier from "../../core/hooks/useStringModifier";
import {
  IChildrenJsonProps,
  INestedChildrenJsonProps,
} from "../../core/types/common";

export interface IRcCheckboxProps {
  text: string;
  toolTip?: string;
  name: string | undefined;
  onChange?(e: React.ChangeEvent<HTMLInputElement>): {};
  children?: INestedChildrenJsonProps[];
  title: string;
  selectedValue?: string[];
  onClick?(e: React.MouseEvent<HTMLInputElement, MouseEvent>): {};
  size?: "MEDIUM" | "SMALL";
  inline?: boolean;
  hint?: string;
  parentName?: string;
  value?: string;
  disabled?: boolean;
  className?: string;
  apiDataId?: string;
  key?: number;
}

export const RcCheckbox = React.memo(
  ({
    text = "",
    toolTip = "",
    name = "",
    onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      return {};
    },
    children = [],
    title = "",
    selectedValue = [],
    onClick = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
      return {};
    },
    size = "MEDIUM",
    inline = false,
    hint = "",
    parentName = "",
    value = "",
    disabled = false,
    className = "",
    apiDataId = "",
    key = 0,
    ...restprops
  }: IRcCheckboxProps) => {
    const { getFinalString } = useStringModifier();
    const finalString = getFinalString(title, apiDataId);
    return (
      <React.Fragment>
        <Checkbox
          name={parentName}
          hint={hint}
          sizeVariant={size ? size : "MEDIUM"}
          onClick={(e) => onClick && onClick(e)}
          onChange={(e) => onChange && onChange(e)}
          value={value}
          title={toolTip ? toolTip : finalString} 
          checked={
            selectedValue && value ? selectedValue.includes(value) : false
          }
          id={value}
          disabled={disabled}
          style={{
            top: "-1px",
            left: "-2px",
            width: "36px",
            height: "36px",
            opacity: 1,
            accentColor: "#fff",
          }}
          data-testid="checkbox-input"
        >
          <RcParagraph text={finalString} />
        </Checkbox>
        {selectedValue?.includes(value) && children?.length > 0 && (
          <div className="govuk-checkboxes__conditional">
            {children.map( 
              (elem: IChildrenJsonProps | INestedChildrenJsonProps) => (
                <Element field={elem} key={elem.displayOrder} />
              )
            )}
          </div>
        )}
      </React.Fragment>
    );
  }
);
