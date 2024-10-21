import { useSelector } from "react-redux";
import { TOKENS } from "../constants/tokens";
import { getFormattedDateTime } from "../utils/formatUtils";
import { formDataSelector, formFieldsDataSelector, formTitleDataSelector } from "./customSelectors";

const useStringModifier = () => {
  const formFieldData = useSelector(formFieldsDataSelector);
  const formData = useSelector(formDataSelector);
  const formTitleData = useSelector(formTitleDataSelector);

  const getFinalString = (tokenizedString: string, dataId?: string) => {
    switch (true) {
      case tokenizedString.indexOf("|") > -1:
        const [string, key] = tokenizedString.split("|");
        switch (true) {
          case string.indexOf(TOKENS.FORM_FIELD_DATA) > -1:
            return replaceTokenWithFormFieldsData(string, key);
          case string.indexOf(TOKENS.FORM_DATA) > -1:
            return replaceTokenWithFormData(string, key);
          case string.indexOf(TOKENS.DATE_TIME) > -1:
            return replaceTokenWithDateTime(string);
          default:
            return tokenizedString;
        }
      case tokenizedString.indexOf(TOKENS.FORM_FIELD_DATA) > -1:
        return replaceTokenWithFormFieldsData(tokenizedString, dataId);
      case tokenizedString.indexOf(TOKENS.FORM_DATA) > -1:
        return replaceTokenWithFormData(tokenizedString, dataId);
      case tokenizedString.indexOf(TOKENS.DATE_TIME) > -1:
        return replaceTokenWithDateTime(tokenizedString);
      case tokenizedString.indexOf(TOKENS.FORMAT_DATE) > -1:
        return replaceTokenWithFormattedDate(tokenizedString, dataId)
      // case tokenizedString.indexOf(TOKENS.LINK) > -1:
      //   return replaceTokenWithLink(tokenizedString, dataId);
      default:
        return tokenizedString;
    }
  };

  const replaceTokenWithFormFieldsData = (string: string, dataId?: string) => {
    if (dataId && dataId.indexOf(".") > -1) {
      let newFormFieldData = resolveNestedkeys(dataId);
      if (typeof newFormFieldData === "string") {
        return string.replace(TOKENS.FORM_FIELD_DATA, newFormFieldData);
      } else {
        return "";
      }
    } else {
      if (formFieldData && dataId && formFieldData[dataId]) {
        return string.replace(TOKENS.FORM_FIELD_DATA, formFieldData[dataId]);
      } else {
        return "";
      }
    }
  };

  const resolveNestedkeys = (dataId: string) => {
    const dataIds = dataId.split(".");
    let newFormFieldData = formFieldData;
    dataIds.forEach((key) => {
      if (newFormFieldData && newFormFieldData[key]) {
        newFormFieldData = newFormFieldData[key];
      }
    });
    return newFormFieldData;
  };

  const replaceTokenWithFormData = (string: string, dataId?: string) => {
    if (formTitleData && dataId && formTitleData[dataId]) {
      if (Array.isArray(formTitleData[dataId])) {
        return formTitleData[dataId];
      }
      return string.replace(TOKENS.FORM_DATA, formTitleData[dataId]);
    } else {
      return string;
    }
  };

  const replaceTokenWithFormattedDate = (string: string, dataId?: string) => {
    if (dataId && formData[dataId]) {
      const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
      const formattedMonth = months[formData[dataId]["month"] - 1]
      
      return string.replace(TOKENS.FORMAT_DATE, `${formData[dataId]["day"]} ${formattedMonth} ${formData[dataId]["year"]}`);
    } else {
      return string;
    }
  };

  const replaceTokenWithDateTime = (string: string) => {
    return string.replace(TOKENS.DATE_TIME, getFormattedDateTime());
  };

  const replaceTokenWithLink = (string: string, dataId?: string) => {
    return dataId ? string.replace(TOKENS.LINK, dataId) : string;
  };

  return {
    getFinalString,
    resolveNestedkeys,
    replaceTokenWithFormFieldsData,
    replaceTokenWithFormData,
    replaceTokenWithDateTime,
    replaceTokenWithLink,
    formFieldData,
    formData,
    formTitleData,
  };
};

export default useStringModifier;
