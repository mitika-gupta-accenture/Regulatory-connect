'use server';
import React from 'react';
import * as session from 'core/models/redis';
import AddContactsClient from './AddContactsClient';
import { FieldType } from 'core/components/FieldFactory';
import { revalidatePath } from 'next/cache';

type OrganisationContact = {
  email: string;
  isPrimary: boolean;
};

async function getCurrentState(field: FieldType) {
  const current = ((await session.getFormState(field.identifier!)) ||
    []) as OrganisationContact[];
  revalidatePath('/');
  return current;
}

export default async function AddContacts({ field }: { field: FieldType }) {
  const current = await getCurrentState(field);

  return <AddContactsClient field={field} current={current} errors={[]} />;
}
