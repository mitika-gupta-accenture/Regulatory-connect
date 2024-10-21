import { removeDigitsUntilLastOccurrence } from "../../../core/utils/formatUtils";
import AddDelHelper from "./AddDelHelper";

const useAddElement = () => {
    const { updateReduxState, selectedValue } = AddDelHelper();
    const handleAddElement = (e: Event, fieldList: any, children: any, formData: any, formFieldData: any) => {

        const prevList = structuredClone(fieldList);
        const firstField = prevList[0];
        console.log("firstField", firstField);
        const lastField = prevList[prevList.length - 1];
        if (lastField.name) {
            fieldList.length === 1 && //will work when we add more elemets
                prevList.forEach((item: any) => {
                    const updatedName = item.name === removeDigitsUntilLastOccurrence(item.name) ? `${item.name}${fieldList.length}` : item.name;
                    const updatedTitle = item.text === removeDigitsUntilLastOccurrence(item.text) ? `${item.text} ${fieldList.length}` : item.text;

                    item.name &&
                        updatedName &&
                        updateReduxState(item.name, String(updatedName), formData); // use to update redux value 
                    item.name = updatedName;
                    item.text = updatedTitle;
                });

            const option = selectedValue(formData, firstField, children, formFieldData)

            const newField = {
                ...firstField,
                name:
                    firstField?.name?.replace(/\d/g, (fieldList.length + 1).toString()),
                text:
                    firstField?.text?.replace(/\d/g, (fieldList.length + 1).toString()),
                options:
                    firstField?.type === "select"
                        ? option.newOpt
                        : firstField?.options,
                apiDataId: firstField?.type === "select" ? "" : firstField?.apiDataId,
            };
            return { prevList, newField };
        }
    }
    return { handleAddElement }
};

export default useAddElement;