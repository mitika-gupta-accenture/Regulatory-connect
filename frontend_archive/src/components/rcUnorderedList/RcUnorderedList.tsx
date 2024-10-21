import React, { useEffect, useState } from "react";
import { LabelText, ListItem, UnorderedList } from "govuk-react";
import { useSelector } from "react-redux";
import useStringModifier from "../../core/hooks/useStringModifier";
import { RootState } from "../../core/store/store";
import { INestedChildrenJsonProps } from "../../core/types/common";
import { RcParagraph } from "../rcParagraph/RcParagraph";
import { TOKENS } from "../../core/constants/tokens";

export interface IRcUnorderedListProps {
  name: string;
  text: string;
  displayOrder?: number;
  apiDataId?: string;
  visible?: boolean;
  children: INestedChildrenJsonProps[];
  listStyleType?: string;
  className?: string;
}

const getAddMoreCompValues = (item: INestedChildrenJsonProps, formData: RootState["applicationFormReducer"]["applicationFormData"]) => {
  const reduxStoredKey = Object.keys(formData).filter((key) =>
    key.startsWith(item.apiDataId?.replace(/\d/g, "") ?? " ")
  );
  const reduxStoredVal: any[] = reduxStoredKey.map((val) => formData[val]);
  return reduxStoredVal;
};

const renderListItem = (content: string | string[], item: INestedChildrenJsonProps, className: string) => {
  if (Array.isArray(content)) {
    if (item?.apiDataId === "AccessPartnersCheckbox") {
      let newContent: any = Array.from(content)?.sort(
        (a: any, b: any) => a?.localeCompare(b)
      );
      return newContent?.map((arrayItem: string) => (
        <ListItem key={arrayItem}>{arrayItem}</ListItem>
      ));
    }
    return content.map((arrayItem: string) => (
      <ListItem key={arrayItem}>{arrayItem}</ListItem>
    ));
  } else if (!content?.includes(TOKENS.FORM_DATA)) {
    return (
      <ListItem key={item.apiDataId}>
        <RcParagraph text={content} className={className} />
      </ListItem>
    );
  }
  return null;
};

export const RcUnorderedList = React.memo(
  ({
    name = "",
    text = "",
    apiDataId = "",
    visible = true,
    children = [],
    listStyleType = "bullet",
    className = "",
  }: IRcUnorderedListProps) => {
    const [renderUnorderedList, setRenderUnorderedList] = useState(true);
    const { getFinalString } = useStringModifier();
    const formData = useSelector(
      (state: RootState) => state.applicationFormReducer.applicationFormData
    );

    useEffect(() => {
      const formDataFieldValue = formData[name];
      if (visible && formDataFieldValue) {
        setRenderUnorderedList(formDataFieldValue);
      }
    }, [formData, name, visible]);

    if (!renderUnorderedList) {
      return null;
    }

    return (
      <>
        {text && <LabelText>{getFinalString(text, apiDataId)}</LabelText>}
        <UnorderedList listStyleType={listStyleType}>
          {children.map((item: INestedChildrenJsonProps) => {
            if (typeof item.text === 'string') {
              const content = item.fromAddMore
                ? getAddMoreCompValues(item, formData)
                : getFinalString(item.text, item.apiDataId);
              return renderListItem(content, item, className);
            }
            return null;
          })}
        </UnorderedList>
      </>
    );
  }
);
