import React, { useEffect, useState } from "react";
import { IChildrenJsonProps } from "../../core/types/common";
import Element from "../element/Element";
import { Link } from "govuk-react";
import { RcButton } from "../rcButton/RcButton";
import { useSelector } from "react-redux";
import { AppDispatch, RootState, useAppDispatch } from "../../core/store/store";
import { FIELD_TYPES } from "../../core/constants/fieldTypes";
import { setApplicationFormFieldsData } from "../../core/features/applicationFormFields/applicationFormFieldsSlice";
import useHandleAddElement from "./utils/useAddElement";
import useHandleDeleteElement from "./utils/useDeleteElement";

export interface AddMoreProps {
  name: string;
  text?: string;
  children?: IChildrenJsonProps[];
  showAddMoreBtn?: boolean;
  showAddMoreLink?: boolean;
  addMoreText?: string;
  deleteFieldText?: string;
  className?: string;
  isNumbered?: boolean;
}

export const AddMore: React.FC<AddMoreProps> = ({
  name,
  showAddMoreBtn = true,
  addMoreText = "Add",
  deleteFieldText = "Delete",
  showAddMoreLink = false,
  children = [],
  isNumbered = false,
}) => {
  const formData = useSelector(
    (state: RootState) => state.applicationFormReducer.applicationFormData
  );
  const [fieldList, setFieldList] = useState<IChildrenJsonProps[]>([]);
  const dispatch: AppDispatch = useAppDispatch()
  const { handleAddElement } = useHandleAddElement();
  const { handleDeleteElement } = useHandleDeleteElement();
  const formFieldData = useSelector(
    (state: RootState) =>
      state.applicationFormFieldsReducer.applicationFormFieldsData
  );

  useEffect(() => {
    const reduxStoredval = Object.keys(formData).filter((key) => // to get redux value if we go next page
      key.startsWith(children[0].name?.replace(/\d/g, "") || name)
    );

    let fieldList: any[] = reduxStoredval.length > 0 ? [] : children;
    reduxStoredval?.forEach((item: string, i) => {
      if (!fieldList?.find((field: any) => field.name === item)) {
        const updatedText = children[0].text?.match(/\d/g) //update summary handles title
          ? children[0].text.replace(/\d/g, `${i + 1}`) //updates names in redux and title
          : `${children[0].text} ${i + 1}`;
        fieldList = [
          ...fieldList,
          { ...children[0], name: item, text: updatedText },
        ];
      }
    });

    setFieldList(fieldList);
  }, [name, children]);


  const handleAddMoreClick = (e: Event) => {
    const data = handleAddElement(e, fieldList, children, formData, formFieldData);
    setFieldList([...data?.prevList, data?.newField])
  }

  const handleDeleteClick = (index: number, name?: string) => {
    const delData = handleDeleteElement(index, name, fieldList, formData)
    setFieldList(delData.updatedFieldList);
  }

  useEffect(() => {
    dispatch(setApplicationFormFieldsData({ [name]: fieldList }))
    return () => { dispatch(setApplicationFormFieldsData({ [name]: null })) }
  }, [fieldList])

  return (
    <React.Fragment>
      {
        fieldList.map((elem: IChildrenJsonProps, i: number) => (
        <div className="govuk-grid-row" key={elem.displayOrder}>
          <Element key={elem.displayOrder} field={elem} layout={elem.layout} />

            {i > 0
              && (
            <div
              className={`govuk-grid-column-one-third govsuk-!-margin-bottom-4 ${elem.type === FIELD_TYPES.TEXT_AREA ? "govuk-!-margin-top-0" : "govuk-!-margin-top-7"}`}
            >
              <Link
                key={elem.displayOrder}
                tabIndex={0}
                className="govuk-link"
                style={{
                  color: "#1d70b8",
                  cursor: "pointer",
                }}
                onClick={() => handleDeleteClick(i, elem.name)}
                onKeyDown={(event: any) =>
                  event.key === "Enter" && handleDeleteClick(i, elem.name)
                }
              >
                {deleteFieldText}
              </Link>
            </div>
          )}
        </div>
      ))}
      {showAddMoreBtn && (
        <RcButton
          name={name}
          className="govuk-body govuk-!-margin-bottom-9"
          text={addMoreText}
          theme="secondary"
          onClick={handleAddMoreClick}
          events={[
            {
              event: "onClick",
              eventHandler: "handleOnClick",
            },
          ]}

        />
      )}
      {showAddMoreLink && (
        <Link
          tabIndex={0}
          className="govuk-link"
          style={{ color: "#1d70b8", cursor: "pointer" }}
          onClick={(e: Event) => handleAddMoreClick(e)}
          onKeyDown={(e: any) => e.key === "Enter" && handleAddMoreClick(e)}
        >
          {addMoreText}
        </Link>
      )}
    </React.Fragment>
  );
};