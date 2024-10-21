import React, { useEffect, useState } from "react";
import { ErrorSummary } from "govuk-react";
import { useSelector } from "react-redux";
import { IChildrenJsonProps, INestedChildrenJsonProps } from "../../core/types/common";
import { FIELD_TYPES } from "../../core/constants/fieldTypes";
import { formErrDataSelector, formFieldsDataSelector } from "../../core/hooks/customSelectors";

export interface IRcErrorSummaryProps {
  requiredComponents: (IChildrenJsonProps | INestedChildrenJsonProps)[]
}

export const RcErrorSummary = React.memo(({ requiredComponents }: IRcErrorSummaryProps) => {

  const { formFieldErrors, showErrors } = useSelector(formErrDataSelector);
  const currentFormFieldData = useSelector(formFieldsDataSelector);

  const [errors, setErrors] = useState<any[]>([])

  useEffect(() => {
    type formattedErrorObj = { targetName: string | undefined, text: string }
    const formattedErrors: formattedErrorObj[] = []

    requiredComponents.forEach((component) => {
      if (formFieldErrors.hasOwnProperty(component.name)) {
        const text: string = formFieldErrors[component.name!]
        let targetName: string = component.name!
        if (component.type === FIELD_TYPES.DATE_FIELD) {
          targetName = component.inputNames[0].day
        }
        formattedErrors.push({ targetName, text })
      } else if (component.type === FIELD_TYPES.ADD_MORE) {
        let targetName: string | undefined
        currentFormFieldData[component.name!].forEach((addMoreChild: IChildrenJsonProps | INestedChildrenJsonProps) => {
          if (formFieldErrors.hasOwnProperty(addMoreChild.name)) {
            targetName = addMoreChild.name
            const text = formFieldErrors[addMoreChild.name!]
            formattedErrors.push({ targetName, text })
          }
        })
      }
    })

    setErrors(formattedErrors)
  }, [formFieldErrors])

  return (
    (showErrors && errors.length > 0) ?
      <ErrorSummary
        description=""
        heading="There is a problem"
        errors={errors}
        onHandleErrorClick={(targetName: string) => {
          const targetElement = document.querySelectorAll(`[name^="${targetName}"]`);
          targetElement?.[0]?.scrollIntoView({ block: 'center' });
        }}
      /> : <></>);
});