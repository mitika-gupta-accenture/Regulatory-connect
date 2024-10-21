'use client';
import {
  Checkboxes,
  Details,
  Paragraph,
  Tag,
} from '@mhra/mhra-design-components';
import { refDataString } from 'core/util/stringModifier';
import { ApiResponseDataType } from 'core/validation/types';
import { useEffect, useState, useMemo } from 'react';
import * as session from 'core/models/redis';

export default function NewDataRequired({
  detailsHeading,
  content,
  apiData,
  apiDataKey,
  identifier,
  useFor,
}: {
  detailsHeading: string;
  content: string;
  apiData?: ApiResponseDataType;
  apiDataKey?: string;
  identifier: string;
  useFor: string;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = (await session.get('new-data-required')) as string[] | null;
      setSelected(data?.includes(useFor) ? useFor : null);
    };

    fetchData();
  }, []);

  const text = useMemo(() => {
    if (apiData && apiDataKey && content) {
      return refDataString(content, apiDataKey, apiData);
    }
    return content;
  }, [apiData, apiDataKey, content]);

  const handleChange = async () => {
    const arrayValue =
      ((await session.get('new-data-required')) as string[]) || [];
    const valueIndex = arrayValue.indexOf(useFor);
    if (valueIndex > -1) {
      arrayValue.splice(valueIndex, 1);
    } else {
      arrayValue.push(useFor);
    }

    await session.set('new-data-required', arrayValue);

    setSelected(arrayValue.includes(useFor) ? useFor : null);
  };

  return (
    <>
      {/* Show the Tag only if `useFor` is in the selected array */}
      {selected === useFor && (
        <Tag id={`${identifier}-tag`} tagColor="red" text="New data required" />
      )}
      <Details heading={detailsHeading} className="govuk-!-margin-top-2">
        <Paragraph text={text} id={`${identifier}-paragraph`} />
        <Checkboxes
          id={`${identifier}-checkbox`}
          options={[
            {
              label: 'New data required',
              value: selected ?? '',
              defaultChecked: selected === useFor,
            },
          ]}
          isSmallerCheckboxes={true}
          onChange={handleChange}
        />
      </Details>
    </>
  );
}
