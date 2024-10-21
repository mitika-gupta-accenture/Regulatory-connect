import { FIELD_TYPES } from "../constants/fieldTypes"
import { IChildrenJsonProps, INestedChildrenJsonProps } from "../types/common"
import { MESSAGE_CONSTANTS } from "../constants/messages"
import { useSelector } from "react-redux"
import { RootState } from "../store/store"
import useTriggerEvents from "./useTriggerEvents"

export const useValidate = () => {
    const currentFormData = useSelector(
        (state: RootState) => state.applicationFormReducer.applicationFormData
    );
    const currentFormFieldData = useSelector(
        (state: RootState) => state.applicationFormFieldsReducer.applicationFormFieldsData
    );
    const currentErrors = useSelector(
        (state: RootState) => state.applicationFormReducer.applicationFormFieldError.formFieldErrors
    );
    const { triggerEvent } = useTriggerEvents()


    const validateAllFields = (requiredComponents: (IChildrenJsonProps | INestedChildrenJsonProps)[]) => {

        const addMoreFields: (IChildrenJsonProps | INestedChildrenJsonProps)[] = []

        const visibleRequiredComponents = requiredComponents?.filter((component: IChildrenJsonProps | INestedChildrenJsonProps) => {
            if (component.type === FIELD_TYPES.DATE_FIELD) {
                const visibleComponents = document.querySelectorAll(`[name=${component.inputNames[0].day}], [name=${component.inputNames[0].month}], [name=${component.inputNames[0].year}]`)
                if (visibleComponents.length > 2) return true
            } else if (component.type === FIELD_TYPES.ADD_MORE) {
                currentFormFieldData[component.name!].forEach((component: IChildrenJsonProps | INestedChildrenJsonProps) => addMoreFields.push(component))
            } else {
                const visibleComponent = document.getElementsByName(component.name!)
                if (visibleComponent.length > 0) return true
            }
            return false
        })

        if (addMoreFields.length > 0) {
            addMoreFields.forEach((component: IChildrenJsonProps | INestedChildrenJsonProps) => visibleRequiredComponents.push(component))
        }

        return visibleRequiredComponents?.map((component) => validateOneField(component.name, component.type, component.errorMessage))
    }

    const validateOneField = (name?: string, type?: string, errorMessage?: string, onChangeValue?: string) => {
        switch (type) {
            case FIELD_TYPES.AUTO_COMPLETE:
                return validateAutoComplete(name, errorMessage, type, onChangeValue)

            case FIELD_TYPES.CHECKBOXES:
                return validateMultipleValues(name, errorMessage, type, onChangeValue)

            case FIELD_TYPES.DATE_FIELD:
                return validateDate(name, errorMessage, type)

            case FIELD_TYPES.INPUT:
                return validateOneValue(name, errorMessage, type, onChangeValue)

            case FIELD_TYPES.RADIOS:
                return validateOneValue(name, errorMessage, type, onChangeValue)

            case FIELD_TYPES.SELECT:
                return validateOneValue(name, errorMessage, type, onChangeValue)

            case FIELD_TYPES.TEXT_AREA:
                return validateOneValue(name, errorMessage, type, onChangeValue)

            default:
                throw new Error(`'${type}' has no validation function`)
        }
    }

    const validateOneValue = (name?: string, errorMessage?: string, type?: string, onChangeValue?: string) => {
        const valueInRedux = currentFormData[name!]
        const currentError = currentErrors[name!]
        const defaultErrorMessage = (type === FIELD_TYPES.RADIOS || type === FIELD_TYPES.SELECT) ? MESSAGE_CONSTANTS.ONE_OPTION : MESSAGE_CONSTANTS.REQUIRED_FIELD
        const error = errorMessage ? errorMessage : defaultErrorMessage
        if (!onChangeValue && (valueInRedux === undefined || valueInRedux === '')) {
            triggerEvent('addFormFieldError', { name: name, value: error })
            return false
        } else if (currentError && onChangeValue && onChangeValue !== '') {
            triggerEvent('deleteFormFieldError', { value: name })
            return true
        }
    }


    const validateMultipleValues = (name?: string, errorMessage?: string, type?: string, onChangeValue?: string) => {
        const valueInRedux = currentFormData[name!]
        const currentError = currentErrors[name!]
        const error = errorMessage ? errorMessage : MESSAGE_CONSTANTS.MULTIPLE_OPTIONS

        if (!onChangeValue && (valueInRedux === undefined || valueInRedux.length === 0)) {
            triggerEvent('addFormFieldError', { name: name, value: error })
            return false
        } else if (currentError && onChangeValue && onChangeValue !== '') {
            triggerEvent('deleteFormFieldError', { value: name })
            return true
        }
    }

    const validateAutoComplete = (name?: string, errorMessage?: string, type?: string, onChangeValue?: string) => {
        const valueInRedux = currentFormData[name!]
        const currentError = currentErrors[name!]
        const error = errorMessage ? errorMessage : MESSAGE_CONSTANTS.AUTO_COMPLETE
        const filteredOptions = currentFormFieldData.licenceNum
        if (onChangeValue === undefined && (valueInRedux === undefined || !filteredOptions?.includes(valueInRedux))) {
            triggerEvent('addFormFieldError', { name: name, value: error })
            return false
        } else if (currentError && onChangeValue && filteredOptions?.includes(onChangeValue)) {
            triggerEvent('deleteFormFieldError', { value: name })
            return true
        }
    }

    const validateDate = (name?: string, errorMessage?: string, type?: string, onChangeValue?: { day: string, month: string, year: string }) => {
        const valueInRedux = currentFormData[name!];
        const currentError = currentErrors[name!];
        const error = errorMessage ?? MESSAGE_CONSTANTS.DATE;
        const dateInput = onChangeValue || valueInRedux;

        const isDateValid = (date: any) => {
            return date?.year !== '' && date?.month !== '' && date?.day !== '' && isDateValidByType(date);
        };

        const isDateValidByType = (date: any) => {
            const year = Number(date?.year);
            const month = Number(date?.month) - 1;
            const day = Number(date?.day);
            const isAuthorisationDate = name?.includes("AuthorisationDate");
            const testDate = isAuthorisationDate ? new Date() : new Date(year, month, day);
            testDate.setHours(0, 0, 0, 0)
            const selectedDate = new Date(year, month, day)
            selectedDate.setHours(0, 0, 0, 0)
            if (isAuthorisationDate) {
                return testDate > selectedDate;
            } else {
                return testDate >= new Date(1900, 0, 1) && testDate <= new Date(year, month, day);
            }
        };

        const handleInvalidDate = () => {
            triggerEvent('addFormFieldError', { name, value: error });
            return false;
        };

        const handleValidDate = () => {
            triggerEvent('deleteFormFieldError', { value: name });
            return true;
        };

        const validateAndHandleDate = () => {
            if (!onChangeValue && !isDateValid(dateInput)) {
                return handleInvalidDate();
            } else if (currentError && onChangeValue && isDateValid(dateInput)) {
                return handleValidDate();
            }
        };

        return validateAndHandleDate();
    };


    return {
        validateOneField,
        validateAllFields,
        validateDate,
        validateAutoComplete,
        validateMultipleValues,
        validateOneValue
    };
}