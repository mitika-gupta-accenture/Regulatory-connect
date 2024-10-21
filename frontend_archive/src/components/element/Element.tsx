import React from "react";
import { useSelector } from "react-redux";
import { GridCol } from "../grid-col/GridCol";
import { IRcInputProps, RcInput } from "../rcInput/RcInput";
import { IRcSelectProps, RcSelect } from "../rcSelect/RcSelect";
import {
  IRcCheckBoxGroupProps,
  RcCheckBoxGroup,
} from "../rcCheckBoxGroup/RcCheckBoxGroup";
import { IRcCheckboxProps, RcCheckbox } from "../rcCheckbox/RcCheckbox";
import { IRcLabelProps, RcLabel } from "../rcLabel/RcLabel";
import { IRcRadioProps, RcRadio } from "../rcRadio/RcRadio";
import { IRcRadioGroupProps, RcRadioGroup } from "../rcRadioGroup/RcRadioGroup";
import { IRcButtonProps, RcButton } from "../rcButton/RcButton";
import { IRcCaptionProps, RcCaption } from "../rcCaption/RcCaption";
import { IRCDetailsProps, RcDetails } from "../rcDetails/RcDetails";
import { ISummaryListProps, SummaryList } from "../summary-list/SummaryList";
import { IRcTableProps, RcTable } from "../rcTable/RcTable";
import {
  IRcButtonGroupProps,
  RcButtonGroup,
} from "../rcButtonGroup/RcButtonGroup";
import { IRcLinkProps, RcLink } from "../rcLink/RcLink";
import { IRcPanelProps, RcPanel } from "../rcPanel/RcPanel";
import { IRcParagraphProps, RcParagraph } from "../rcParagraph/RcParagraph";
import { IRcInsetTextProps, RcInsetText } from "../rcInsetText/RcInsetText";
import { ILinkProps, PrevLink } from "../link/PrevLink";
import { RcParagraphWithLink } from "../rcParagraph/RcParagraphWithLink";
import { FIELD_TYPES } from "../../core/constants/fieldTypes";
import {
  IChildrenJsonProps,
  INestedChildrenJsonProps,
} from "../../core/types/common";
import { RootState } from "../../core/store/store";
import useConditionEvaluator from "../../core/hooks/useConditionEvaluator";
import useEventHandlers from "../../core/hooks/useEventHandlers";
import { getColumnClassName } from "../../core/utils/renderUtils";
import { RcDateField, RcDateFieldProps } from "../rcDateField/RcDateField";
import { AutoComplete, AutocompleteProps } from "../autoComplete/AutoComplete";
import { AddMore, AddMoreProps } from "../addMore/AddMore";
import {
  RcUnorderedList,
  IRcUnorderedListProps,
} from "../rcUnorderedList/RcUnorderedList";
import { RcTextArea, RcTextAreaProps } from "../rcTextArea/RcTextArea";
import { IRcHintTextProps, RcHintText } from "../rcHintText/RcHintText";

interface IElementProps {
  field: IChildrenJsonProps | INestedChildrenJsonProps;
  layout?: string;
  customClassName?: string;
  key?: any;
  renderGridCol?: boolean;
}

export const Element = React.memo(
  ({
    field,
    layout = "full",
    customClassName,
    key = 0,
    renderGridCol,
  }: IElementProps) => {
    const { evaluateLogicalConditions } = useConditionEvaluator();
    const { handleDeleteFieldData } = useEventHandlers();
    const formData = useSelector(
      (state: RootState) => state.applicationFormReducer.applicationFormData
    );

    const { oddColumnClassName, evenColumnClassName } =
      getColumnClassName(layout);

    if (field.visible === false) {
      return null; 
    }

    const getElement = (): React.ReactNode => {
      switch (field.type) {
        case FIELD_TYPES.INPUT:
          return <RcInput {...(field as IRcInputProps)} />;
        case FIELD_TYPES.INSET:
          return <RcInsetText {...(field as IRcInsetTextProps)} />;
        case FIELD_TYPES.LABEL:
          return <RcLabel {...(field as IRcLabelProps)} />;
          case FIELD_TYPES.BUTTON:
            return <RcButton {...(field as IRcButtonProps)} />;
          case FIELD_TYPES.BUTTONS:
            return <RcButtonGroup {...(field as IRcButtonGroupProps)} />;
          case FIELD_TYPES.LINK:
            return <RcLink {...(field as IRcLinkProps)} />;
          case FIELD_TYPES.PREV_LINK:
            return <PrevLink {...(field as ILinkProps)} />;
          case FIELD_TYPES.SELECT:
            return <RcSelect {...(field as IRcSelectProps)} />;
          case FIELD_TYPES.CAPTION:
            return <RcCaption {...(field as IRcCaptionProps)} />;
          case FIELD_TYPES.ADD_MORE:
            return <AddMore {...(field as AddMoreProps)} />;
          case FIELD_TYPES.HINT_LABEL:
            return <RcDetails {...(field as IRCDetailsProps)} />;
          case FIELD_TYPES.LIST:
            return <SummaryList {...(field as ISummaryListProps)} />;
          case FIELD_TYPES.AUTO_COMPLETE:
            return <AutoComplete {...(field as AutocompleteProps)} />;
          case FIELD_TYPES.RADIOS:
            return <RcRadioGroup {...(field as IRcRadioGroupProps)} />;
          case FIELD_TYPES.RADIO:
            return <RcRadio {...(field as IRcRadioProps)} />;
          case FIELD_TYPES.CHECKBOXES:
            return <RcCheckBoxGroup {...(field as IRcCheckBoxGroupProps)} />;
          case FIELD_TYPES.CHECKBOX:
            return <RcCheckbox {...(field as IRcCheckboxProps)} />;
          case FIELD_TYPES.TABLE:
            return <RcTable {...(field as IRcTableProps)} />;
          case FIELD_TYPES.PANEL:
            return <RcPanel {...(field as IRcPanelProps)} />;
          case FIELD_TYPES.PARAGRAPH:
            return <RcParagraph {...(field as IRcParagraphProps)} />;
          case FIELD_TYPES.PARAGRAPH_WITH_LINK:
            return <RcParagraphWithLink {...(field as IRcParagraphProps)} />;
          case FIELD_TYPES.UNORDERED_LIST:
            return <RcUnorderedList {...(field as IRcUnorderedListProps)} />;
          case FIELD_TYPES.TEXT_AREA:
            return <RcTextArea {...(field as RcTextAreaProps)} />;
          case FIELD_TYPES.HINT_TEXT:
            return <RcHintText {...(field as IRcHintTextProps)} />;
          case FIELD_TYPES.DATE_FIELD:
            return <RcDateField {...(field as RcDateFieldProps)} />;
          default:
            return <p>field type: '{field.type}' is not defined</p>;
        }
    };


    const shouldRenderElement = () => {
      const isVisibilityConditionMet = !field.visibilityCondition || evaluateLogicalConditions(field.visibilityCondition);
      
      if (isVisibilityConditionMet === "") {
        return false;
      }
      
        return isVisibilityConditionMet || renderGridCol;

    }
    

    const handleRender = () => {
      if (shouldRenderElement()) {
        return (
          <GridCol
          className={`${key % 2 === 0 ? oddColumnClassName : evenColumnClassName} ${customClassName ?? ''}`}
            key={key}
          >
            {getElement()}
          </GridCol>
        );
      } else if (field.name && formData[field.name]) {
        handleDeleteFieldData(field.name);
      }
      return null;
    };
    
    return handleRender();
  }
);

export default Element;
