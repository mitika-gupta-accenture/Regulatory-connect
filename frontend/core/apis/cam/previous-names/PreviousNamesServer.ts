'use server';
import * as session from 'core/models/redis';
import _ from 'lodash';
import { revalidatePath } from 'next/cache';

export async function addName(fieldId: string, form: FormData) {
  const prevName = form.get(`${fieldId}-text`)?.toString()?.trim();

  const errors: { field: string; message: string }[] = [];
  if (!prevName) {
    errors.push({ field: fieldId, message: "Enter a previous name" });
  }

  if (errors.length !== 0) {
    return {
      prevName,
      errors,
    };
  }

  const existing = ((await session.getFormState(fieldId)) ??
    []) as string[];
  const newNames = _.uniq([...existing, prevName]);
  await session.setFormState(fieldId, newNames)
    .then(() => {
      revalidatePath('/');
    });
}

export async function removeName(fieldId: string, name: string) {
  const existing = ((await session.getFormState(fieldId)) ??
    []) as string[];
  const newContacts = _.filter(
    existing,
    x => x !== name,
  );

  await session.setFormState(fieldId, newContacts);
  revalidatePath('/');
}
