'use client';

import {
  Autocomplete as GovUkAutoComplete,
  Select,
} from '@mhra/mhra-design-components';
import React, { useState, useEffect } from 'react';
import { ErrorSummaryType, ErrorType } from './ErrorSummary';
import FindErrorMessage from '../util/Errors';
import { AutocompleteProps } from '@mhra/mhra-design-components/dist/components/autocomplete/autocomplete.types';
import useDebounce from 'core/test/unit/util/debounce';
import { ApiResponseDataType } from 'core/validation/types';

export type AutocompleteAnswer = {
  value: string;
  label: string;
};

export interface AutocompleteFieldType extends AutocompleteProps {
  type: 'autocomplete';
  identifier: string;
  apiEndPoint: string;
  apiDataKey: string;
  showChangeLinkInSummary?: boolean;
  addMoreButtonText?: string;
  addMoreButtonType?: string;
  label?: string;
}

export interface ApiDataType {
  [key: string]: AutocompleteAnswer[];
}
const AutoComplete = ({
  field,
  errorSummary,
  previousAnswer,
  apiData,
}: {
  field: AutocompleteFieldType;
  errorSummary: ErrorSummaryType;
  previousAnswer?: string;
  apiData: ApiDataType;
}) => {
  const isApiDataType = (data: any): data is ApiDataType => {
    return data && typeof data === 'object' && !Array.isArray(data);
  };
  const updatedAPIDetails: AutocompleteAnswer[] = isApiDataType(apiData)
    ? (apiData[field.apiDataKey]?.map(
        ({ name, identifier }: ApiResponseDataType) => ({
          label: name,
          value: identifier,
        }),
      ) ?? [])
    : [];
  const [suggestionOptions, setSuggestionOptions] =
    useState<AutocompleteAnswer[]>(updatedAPIDetails);
  const [isJavascriptDisabled, setIsJavascriptDisabled] = useState(true);
  const previousSelectedValue = suggestionOptions?.find(
    el => el.value === previousAnswer,
  );
  const [value, setValue] = useState<AutocompleteAnswer>(
    previousSelectedValue || { label: '', value: '' },
  );
  const [isSelectFromDropdown, setIsSelectFromDropdown] = useState('false');
  const debouncedValue: string = useDebounce(value?.label, 300);
  const errMsg = FindErrorMessage(errorSummary, field);

  const fetchSuggestions = async () => {
    let apiResponseData = updatedAPIDetails;
    const shouldFetch = debouncedValue?.length > 2;
    if (shouldFetch) {
      let options = apiResponseData?.map((option: any) => {
        if (
          option?.label
            ?.toLowerCase()
            .includes(debouncedValue?.trim()?.toLocaleLowerCase())
        ) {
          return option;
        }
      });
      options = options.filter((data: any) => data !== undefined);
      setSuggestionOptions(options);
    }
  };

  useEffect(() => {
    if (isJavascriptDisabled) {
      setIsJavascriptDisabled(false);
    }
  }, []);
  useEffect(() => {
    fetchSuggestions();
  }, [debouncedValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSelectFromDropdown('false');
    setValue({ label: e.target.value, value: e.target.value });
  };

  const handleSuggestionSelect = (selectedData: AutocompleteAnswer) => {
    setIsSelectFromDropdown('true');
    setValue(selectedData);
  };
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setValue({ label: event.target.value, value: event.target.value });
  };
  if (isJavascriptDisabled) {
    return (
      <Select
        name={field.identifier}
        label={field.label || ''}
        options={[{ label: 'Select Radio', value: '' }, ...suggestionOptions]}
        hint={field.hint}
        errorMessage={errMsg}
        defaultValue={value?.value}
        onSelect={handleSelectChange}
        className={field.className}
      />
    );
  }
  return (
    <>
      <GovUkAutoComplete
        name={`label-${field.identifier}`}
        minInputChars={3}
        hint={field?.hint}
        id={field.identifier}
        errorMessage={errMsg}
        value={value?.label}
        widthSize={field?.widthSize}
        label={field?.label}
        labelSize={field?.labelSize}
        fluidWidth={field?.fluidWidth}
        onChange={handleChange}
        onSuggestionSelect={handleSuggestionSelect}
        autoSuggest={suggestionOptions}
      />
      <input type="hidden" name={`${field?.identifier}`} value={value?.value} />
      <input
        type="hidden"
        name={`${field?.identifier}-flag-hidden`}
        value={isSelectFromDropdown}
      />
    </>
  );
};

export default AutoComplete;
