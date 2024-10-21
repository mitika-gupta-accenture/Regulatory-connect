import React from "react";
import { InsetText, Paragraph } from "govuk-react";
import useStringModifier from "../../core/hooks/useStringModifier";
import { IRcButtonProps, RcButton } from "../rcButton/RcButton";
import { IChildrenJsonProps } from "../../core/types/common";

export interface IRcInsetTextProps {
  text: string;
  apiDataId: string;
  children: IChildrenJsonProps[];
}

export const RcInsetText = React.memo((props: IRcInsetTextProps) => {
  const { getFinalString } = useStringModifier();

  return (
    <InsetText>
      <Paragraph mb={0}>
        {getFinalString(props.text, props.apiDataId)}
      </Paragraph>
      {(props.children && props.children.length > 0) && props.children.map((buttonProps) => <RcButton {...(buttonProps as IRcButtonProps)} />)}
    </InsetText>
  );
});
