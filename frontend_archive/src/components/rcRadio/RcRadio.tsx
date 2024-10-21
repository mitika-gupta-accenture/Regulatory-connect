import React from "react";
import { Radio } from "govuk-react";
import Element from "../element/Element";
import { RcParagraph } from "../rcParagraph/RcParagraph";
import useStringModifier from "../../core/hooks/useStringModifier";
import { IChildrenJsonProps } from "../../core/types/common";

export interface IRcRadioProps {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => {};
  children?: IChildrenJsonProps[];
  title: string;
  disabled?: boolean;
  selectedValue?: string | number | readonly string[];
  value?: string;
  size?: "MEDIUM" | "SMALL";
  inline?: boolean;
  hint?: string;
  parentName?: string;
  apiDataId?: string;
}

export const RcRadio = React.memo(
  ({
    onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      return {};
    },
    children = [],
    title = "",
    disabled = false,
    selectedValue = undefined,
    value = "",
    size = "MEDIUM",
    inline = false,
    hint = "",
    parentName = "",
    apiDataId = "",
    ...restProps
  }: IRcRadioProps) => {
    const { getFinalString } = useStringModifier();
    const finalString = getFinalString(title, apiDataId);

    return (
      <React.Fragment>
        <Radio
          name={parentName}
          hint={hint ? getFinalString(hint, "") : ""}
          inline={inline}
          title={`${finalString} ${hint ? getFinalString(hint, "") : ""}`}
          sizeVariant={size ? size : "MEDIUM"}
          value={value}
          onChange={(e) => onChange && onChange(e)}
          checked={selectedValue === value}
          id={value}
          disabled={disabled}
          style={{
            top: "-1px",
            left: "-3px",
            width: "36px",
            height: "36px",
            opacity: 1,
            accentColor: "#000",
          }}
        >
          <RcParagraph
            className={"govuk-!-margin-bottom-0"}
            text={finalString}
          />
        </Radio>
        {selectedValue === value && children?.length > 0 && (
          <div className="govuk-radios__conditional">
            {children.map((elem: IChildrenJsonProps, i: number) => (
              <Element key={elem.name} field={elem} />
            ))}
          </div>
        )}
      </React.Fragment>
    );
  }
);
