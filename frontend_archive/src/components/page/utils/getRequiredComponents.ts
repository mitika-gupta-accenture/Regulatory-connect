import { FIELD_TYPES, USER_INPUT_FIELD_TYPES } from "../../../core/constants/fieldTypes";
import { IChildrenJsonProps, ICompOptionProps, INestedChildrenJsonProps, ISectionJsonProps } from "../../../core/types/common";

export const getRequiredComponents = (sections: ISectionJsonProps[]) => {
    const allRequiredComponents: (IChildrenJsonProps | INestedChildrenJsonProps)[] = []

    const checkChildrenOfRadios = (element: IChildrenJsonProps) => {
      element.options!.forEach((radio: ICompOptionProps) => {
        radio.hasOwnProperty('children') && radio.children!.forEach((nestedElement) => {
          if (nestedElement.required !== false && USER_INPUT_FIELD_TYPES.includes(nestedElement.type!)) {
            allRequiredComponents.push(nestedElement);
          }
        })
      })
    }

    sections.forEach((section: ISectionJsonProps) => {
      section.children.forEach((element) => {
        if (element.required !== false && USER_INPUT_FIELD_TYPES.includes(element.type!)) {
          allRequiredComponents.push(element)
          element.type === FIELD_TYPES.RADIOS && checkChildrenOfRadios(element)
        } 
      })
    })

    return allRequiredComponents
}