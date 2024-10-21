import useEventHandlers from "../../../core/hooks/useEventHandlers";
import { removeDigitsUntilLastOccurrence } from "../../../core/utils/formatUtils";
import AddDelHelper from "./AddDelHelper";

const useDeleteElement = () => {
    const { handleDeleteFieldData } = useEventHandlers();
    const { updateReduxState } = AddDelHelper();


    const handleDeleteElement = (index: number, name?: string, fieldList?: any, formData?: any) => {
        const updatedFieldList = structuredClone(fieldList)
        updatedFieldList.splice(index, 1);
        name && handleDeleteFieldData(name);
        updatedFieldList.forEach((item: any, i: number) => {
            const indexInName = item?.name?.replace(/\D/g, ""); // && item.name.match(/\d+/)[0];
            if (indexInName !== "" && indexInName !== (i + 1).toString()) {
                const updatedName =

                    indexInName && `${removeDigitsUntilLastOccurrence(item?.name)}${i + 1}`;
                const updatedTitle = `${removeDigitsUntilLastOccurrence(item?.text)}${i + 1}`;
                if (item.name && updatedName) {
                    updateReduxState(item.name, updatedName, formData);
                    item.name = updatedName;
                }
                item.text = updatedTitle;
            } else if (updatedFieldList.length === 1) {
                const updatedName = item?.name?.replace(/\d/g, "");
                const updatedTitle = item?.text?.replace(/\d/g, "");
                if (item.name && updatedName) {
                    updateReduxState(item.name, updatedName, formData);
                    item.name = updatedName;
                }
                item.text = updatedTitle;
            }
        });
        return { updatedFieldList };
    };
    return { handleDeleteElement }
}

export default useDeleteElement