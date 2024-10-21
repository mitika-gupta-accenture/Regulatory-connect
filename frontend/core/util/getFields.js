import Formatters from './Formatters';

export function getFields(question, queryData, formState) {
  return question.fields
    .map(field => {
      const identifier = field?.identifier || 'no-identifier';
      const formatType = field?.formatType || 'no-formatType';
      let answers = queryData.getAll(identifier) || '';
      if (field?.fields) {
        field?.fields.map(nestedField => {
          if (nestedField.identifier) {
            const nestedAnswer = queryData.getAll(nestedField.identifier);
            answers = [...answers, nestedAnswer[0]];
          }
        });
      }
      if (field?.type === 'date') {
        const day = queryData.getAll(`${identifier}--day`);
        const month = queryData.getAll(`${identifier}--month`);
        const year = queryData.getAll(`${identifier}--year`);
        answers = [];
        if (day[0] && month[0] && year[0]) {
          answers = [`${year}-${month}-${day}`];
        }
      }
      if (field?.type === 'autocomplete') {
        const isSelectedFromDropdown =
          queryData.getAll(`${identifier}-flag-hidden`) || '';
        if (isSelectedFromDropdown?.[0] === 'false') {
          answers = [''];
        }
      }

      if (field?.rule == 'add-another') {
        const stateFields = formState
          .map(state => {
            return state[field.fields[0].identifier];
          })
          .flat(Infinity);
        const fieldsFromState = {
          ...field,
          fields: stateFields,
        };
        return getFields(fieldsFromState, queryData);
      }

      let answersObjectArray = answers.map(answer => {
        let subFields = [];

        const fieldAnswerValue = field?.answers
          ?.map(e => e.value)
          .indexOf(answer);
        const fieldAnswer = field?.answers
          ? field?.answers[fieldAnswerValue]
          : false;

        const nestedField = field?.answers
          ? (fieldAnswer ?? field.answers[0])
          : field;
        if (formatType.includes('trimURL')) {
          answer = Formatters.trimURL(answer);
        }

        if (nestedField?.fields) {
          subFields = getFields(nestedField, queryData);
        }
        return [
          ...subFields,
          {
            identifier: field?.identifier || 'no-identifier',
            answer: answer,
            label: fieldAnswer?.label || field?.label || '',
            code: fieldAnswer?.code || field?.code || '',
            route: fieldAnswer?.route || '',
            ...(fieldAnswer?.showChangeLinkInSummary ||
            field?.showChangeLinkInSummary
              ? {
                  showChangeLinkInSummary:
                    fieldAnswer?.showChangeLinkInSummary ||
                    field?.showChangeLinkInSummary,
                }
              : {}),
            ...(fieldAnswer?.apiDataKey || field?.apiDataKey
              ? {
                  apiDataKey: fieldAnswer?.apiDataKey || field?.apiDataKey,
                }
              : {}),
          },
        ].flat(Infinity);
      });

      return [answersObjectArray];
    })

    .flat(Infinity)
    .filter(item => item.identifier !== 'no-identifier');
}
