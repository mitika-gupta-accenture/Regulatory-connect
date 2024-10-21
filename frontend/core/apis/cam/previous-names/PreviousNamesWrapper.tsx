'use server';
import React from 'react';
import * as session from 'core/models/redis';
import PreviousNamesClient from './PreviousNamesClient';
import { FieldType } from 'core/components/FieldFactory';
import { revalidatePath } from 'next/cache';

async function getCurrentState(field: FieldType) {
  const current = ((await session.getFormState(field.identifier!)) ||
    []) as string[];
  revalidatePath('/');
  return current;
}

export default async function PreviousNames({ field }: { field: FieldType }) {
  const current = await getCurrentState(field);

  return <PreviousNamesClient field={field} current={current} errors={[]} />;
}
