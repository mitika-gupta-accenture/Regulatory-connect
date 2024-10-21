import { Answer, ApiElementType, Field } from '../validation/types';

// Function to map API data to question fields
export const mapApiDataToJson = (
  questionFieldData: Field,
  data: ApiElementType[],
) => {
  // Created separate maps for top-level Field and nested field identifiers
  const createFieldIdentifierToLabelMap = (
    data: ApiElementType[],
  ): Map<string, string> => {
    const fieldDict = new Map<string, string>();

    if (questionFieldData?.subApiDataKey) {
      const subFieldEqualArray = questionFieldData.subApiDataKey.includes('=')
        ? questionFieldData.subApiDataKey.split('=')
        : [];
      const subFieldNestedArray = subFieldEqualArray[1]?.includes('.')
        ? subFieldEqualArray[1].split('.')
        : [];

      const filteredData = data?.filter((subData: ApiElementType) => {
        if (subFieldNestedArray.length > 0) {
          return (
            subData?.[subFieldEqualArray[0]]?.toString() ===
            subFieldNestedArray[0]
          );
        }
        return false;
      })?.[0]?.subGroup;

      filteredData?.forEach(item => {
        if (item.identifier) {
          fieldDict.set(
            String(item.identifier),
            item.name + '|' + item.code || '',
          );
        }
      });
    } else {
      data?.forEach(item => {
        if (item.identifier) {
          fieldDict.set(
            String(item.identifier),
            item.name + '|' + item.code || '',
          );
        }
      });
    }
    return fieldDict;
  };

  const createNestedFieldIdentifierToLabelMap = (
    data: ApiElementType[],
  ): Map<string, string> => {
    const nestedFieldDict = new Map<string, string>();

    data?.forEach((item, i) => {
      if (item.subGroup) {
        item.subGroup.forEach(sub => {
          nestedFieldDict.set(
            String(sub.identifier) + '.' + String(i),
            sub.name + '|' + sub.code ?? '',
          );
        });
      }
    });
    return nestedFieldDict;
  };

  // Generate identifier to label maps
  const fieldIdentifierToLabelMap = createFieldIdentifierToLabelMap(data);
  const nestedFieldIdentifierToLabelMap =
    createNestedFieldIdentifierToLabelMap(data);
  // Helper functions to get label by identifier
  const getTopLevelLabelByIdentifier = (code: string) => {
    let identifier;
    data?.forEach(item => {
      if (code === String(item.code) || code === String(item.identifier)) {
        identifier = item.identifier;
      }
    });
    return (
      fieldIdentifierToLabelMap.get(String(identifier))?.split('|') || [
        identifier ?? '',
        '',
      ]
    );
  };

  const getNestedFieldLabelByIdentifier = (code: string, index: number) => {
    let identifier;
    data?.forEach((item, i) => {
      if (item.subGroup) {
        item.subGroup.forEach(sub => {
          if (code === String(sub.code)) {
            identifier = sub.identifier;
          }
        });
      }
    });
    return (
      nestedFieldIdentifierToLabelMap
        .get(String(identifier) + '.' + String(index))
        ?.split('|') || [identifier ?? '', '']
    );
  };

  const nestedDirectVal = (index: number) => {
    // Create an array of objects based on the condition
    const result = Array.from(nestedFieldIdentifierToLabelMap.entries())
      .map(([key, value]) => {
        const [keyBeforeDot, keyAfterDot] = key.split('.');
        const [val, code] = value.split('|');

        // Check if the part after the decimal point matches the index
        if (keyAfterDot === String(index)) {
          return {
            label: val,
            value: keyBeforeDot,
            route: undefined,
            code: code,
          };
        }

        // Return null for entries that do not match
        return {
          label: '',
          value: '',
          route: undefined,
          code: '',
        };
      })
      // Filter out the null values
      .filter(
        item => item.label !== '' || item.value !== '' || item.code !== '',
      );

    return result;
  };

  // Function to transform nested field answers
  const transformNestedFieldAnswers = (field: Field, index: number): Field => {
    return {
      ...field,
      apiDataKey: '',
      answers:
        (field.answers?.map(answer => {
          const [label, code] = getNestedFieldLabelByIdentifier(
            String(answer.value),
            index,
          );
          return {
            label: label,
            value: answer.value,
            route: answer.route,
            hint: answer?.hint,
            code: code,
          };
        }) ||
          nestedDirectVal(index)) ??
        [],
    };
  };

  // function to transform nested fields only when parent is from JSON
  const transformOnlyNestedFieldAnswers = (field: Field): Field => {
    return {
      ...field,
      apiDataKey: '',
      answers:
        (field.answers?.map(answer => {
          const [label, code] = getTopLevelLabelByIdentifier(
            String(answer.value),
          );
          return {
            label: label,
            value: answer.value,
            route: answer.route,
            hint: answer?.hint,
            code: code,
          };
        }) ||
          answerDirectVal()) ??
        [],
    };
  };

  // Function to transform top-level field answers
  const transformFieldAnswers = (answer: Answer, index: number): Answer => {
    const [label, code] = questionFieldData.apiDataKey
      ? getTopLevelLabelByIdentifier(String(answer.value))
      : [answer.label, answer.code];

    return {
      label: label,
      code: code,
      value: answer.value,
      route: answer.route,
      fields: answer.fields
        ? answer.fields[0]?.apiDataKey && questionFieldData.apiDataKey
          ? answer.fields.map(field =>
              transformNestedFieldAnswers(field, index),
            )
          : answer.fields[0]?.apiDataKey
            ? answer.fields.map(transformOnlyNestedFieldAnswers)
            : answer.fields
        : [],
    };
  };

  const answerDirectVal = () => {
    // Create an array of objects based on the condition
    const result = Array.from(fieldIdentifierToLabelMap.entries())
      .map(([key, value]) => {
        const [val, code] = value.split('|');
        return {
          label: val,
          value: key,
          route: undefined,
          code: code,
        };
      })
      // Filter out the null values
      .filter(
        item => item.label !== '' || item.value !== '' || item.code !== '',
      );

    return result;
  };

  // Transform the questionFieldData data
  return questionFieldData.answers
    ? questionFieldData.answers?.map(transformFieldAnswers)
    : (questionFieldData.apiDataKey && answerDirectVal()) || [];
};
