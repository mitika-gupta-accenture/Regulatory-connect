/* eslint-disable prettier/prettier */
'use server';

import { revalidatePath } from 'next/cache';
import * as session from '../../models/redis';
import { FieldType } from 'core/components/FieldFactory';
import { Validation } from 'core/validation/types';
import { InputProps } from '@mhra/mhra-design-components/dist/components/input/input.types';

export interface StateFieldType extends InputProps {
  type: 'text';
  identifier: string;
  validations?: Validation;
  value?: string;
}

async function updateStateValue(firstFieldID: string, formData: FormData) {
  const currentAnswer = (await session.getFormState(
    firstFieldID,
  )) as StateFieldType[];

  currentAnswer.forEach(
    (item, idx) =>
      (currentAnswer[idx] = {
        ...item,
        value: formData.get(item?.identifier) as string,
      }),
  );

  return currentAnswer;
}

export async function addAnotherBehavior(
  field: FieldType,
  firstFieldID: string,
  formData: FormData,
) {
  const currentAnswer = await updateStateValue(firstFieldID, formData);
  const newIndex = currentAnswer.length + 1;

  if (currentAnswer.length === 1) {
    currentAnswer[0].label = `${currentAnswer[0].label} 1`;
  }

  const updatedField = {
    ...field,
    identifier: `${field.identifier}-${newIndex}`,
    label: `${field?.label} ${newIndex}`,
    value: '',
  } as StateFieldType;

  currentAnswer.push(updatedField);

  await session.setFormState(firstFieldID, currentAnswer);
  revalidatePath('/');
}

export async function removeAnotherBehaviour(
  field: FieldType,
  firstFieldID: string,
  formData: FormData,
) {
  const currentAnswer = await updateStateValue(firstFieldID, formData);
  const newAnswer = currentAnswer.filter(
    a => a.identifier !== field.identifier,
  );

  newAnswer.forEach((item, index) => {
    const newIndex = index + 1;
    if (index !== 0) {
      item.identifier = `${firstFieldID}-${newIndex}`;
    }

    if (newAnswer.length === 1) {
      item.label = item.label.replace(/\s\d+$/, '');
    } else {
      item.label = `${item.label.replace(/\s\d+$/, '')} ${newIndex}`;
    }
  });

  await session.setFormState(firstFieldID, newAnswer);
  revalidatePath('/');
}
