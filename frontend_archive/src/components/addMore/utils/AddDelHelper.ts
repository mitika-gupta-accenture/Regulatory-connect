import useEventHandlers from "../../../core/hooks/useEventHandlers";
import useTriggerEvents from "../../../core/hooks/useTriggerEvents";

const AddDelHelper = () => {
    const { handleDeleteFieldData } = useEventHandlers();
    const { triggerEvent } = useTriggerEvents();

    const updateReduxState = (name: string, updatedName: string, formData: any) => {
        const storedVal = formData[name];
        handleDeleteFieldData(name);
        const updatedState = {
            target: {
                name: updatedName,
                value: storedVal,
                title: storedVal,
            },
        };
        triggerEvent("handleChange", updatedState.target);
    };

    const getOptions = (fieldOptions: any[], children: any) => {
        if (
            fieldOptions &&
            Array.isArray(fieldOptions) &&
            fieldOptions.length
        ) {
            let updatedOptions = fieldOptions.map((option) => ({
                title: option,
                value: option,
            }));
            const defaultOption = children[0].options && children[0].options[0];
            defaultOption &&
                updatedOptions.unshift({
                    title: defaultOption?.title,
                    value: defaultOption.value,
                });
            return updatedOptions;
        } else {
            return children[0].options || [];
        }
    };

    const selectedValue = (formData: any, firstField: any, children: any, formFieldData: any) => {

        const alreadySelectedValue = Object.keys(formData)
            .filter(
                (formKey) =>
                    firstField.name &&
                    new RegExp(firstField.name.replace(/\d/g, ""), "i").test(formKey)
            )
            .map((formKey) => formData[formKey]);
        const newOpt = firstField?.apiDataId
            ? getOptions(formFieldData[firstField.apiDataId], children)
            : children[0].options;

        return { alreadySelectedValue, newOpt }
    }
    return { updateReduxState, getOptions, selectedValue }
}

export default AddDelHelper