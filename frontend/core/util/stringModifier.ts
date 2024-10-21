export const IDENTIFIERS = {
  USER_SESSION: '###',
  CMS_CONTENT: '!!!',
  REF_DATA: '$$$',
};

// Main function to process and replace data
export const refDataString = (
  dataString: string,
  apiDataKey: string,
  userSessionData: Object,
) => {
  // Set the apiData in the session
  if (dataString.indexOf('{') > -1) {
    const [string, restString] = dataString.split('{');
    const [key, rem] = restString.split('}');

    if (string.indexOf(IDENTIFIERS.USER_SESSION) > -1) {
      return replaceWithUserSessionData(
        string + rem,
        apiDataKey,
        userSessionData,
      );
    } else if (string.indexOf(IDENTIFIERS.CMS_CONTENT) > -1) {
      return replaceWithCmsData(string, key);
    } else if (string.indexOf(IDENTIFIERS.REF_DATA) > -1) {
      return replaceWithRefData(string, key);
    } else {
      return dataString;
    }
  } else if (dataString.indexOf(IDENTIFIERS.USER_SESSION) > -1) {
    return replaceWithUserSessionData(dataString, apiDataKey, userSessionData);
  } else if (dataString.indexOf(IDENTIFIERS.CMS_CONTENT) > -1) {
    return replaceWithCmsData(dataString, apiDataKey);
  } else if (dataString.indexOf(IDENTIFIERS.REF_DATA) > -1) {
    return replaceWithRefData(dataString, apiDataKey);
  } else {
    return dataString;
  }
};

// Function to replace USER_SESSION data
const replaceWithUserSessionData = (
  string: string,
  dataId: string,
  userSessionData: Object,
) => {
  // const apiString = resolveNestedkeys(key,userSessionData);
  let dataIds = dataId.split('.');
  let newFormFieldData: any = dataIds ? userSessionData : [];
  // dataIds = dataIds?.slice(1)
  if (dataIds && newFormFieldData) {
    for (const key of dataIds) {
      if (key && newFormFieldData[key]) {
        newFormFieldData = newFormFieldData[key];
      } else {
        return ''; // Return empty string if key not found
      }
    }
  }

  newFormFieldData = newFormFieldData as string;

  return string.replace(IDENTIFIERS.USER_SESSION, newFormFieldData || ''); // Handle case where apiString might be undefined
};

// Placeholder functions for CMS and REF_DATA replacement
const replaceWithCmsData = (string: string, key: string) => {
  // Implement logic to replace CMS content
  return ''; // Replace with actual implementation
};

const replaceWithRefData = (string: string, key: string) => {
  // Implement logic to replace reference data
  return ''; // Replace with actual implementation
};