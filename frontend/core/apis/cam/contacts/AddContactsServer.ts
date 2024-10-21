'use server';
import * as session from 'core/models/redis';
import _ from 'lodash';
import { revalidatePath } from 'next/cache';

type OrganisationContact = {
  email: string;
  isPrimary: boolean;
};

export async function addContact(fieldId: string, form: FormData) {
  const email = form.get('email');

  const errors: { field: string; message: string }[] = [];
  if (!email) {
    errors.push({ field: 'email', message: "Enter the contact's email" });
  }

  console.log('errors: ', errors)

  if (errors.length !== 0) {
    return {
      email,
      errors,
    };
  }

  const contact: OrganisationContact = {
    email: email as string,
    isPrimary: false,
  };

  const existing = ((await session.getFormState(fieldId)) ??
    []) as OrganisationContact[];
  if (existing.length === 0) {
    contact.isPrimary = true;
  }
  const newContacts = _.uniqBy([...existing, contact], x => x.email);
  await session.setFormState(fieldId, newContacts)
    .then(() => {
      revalidatePath('/');
    });
}

export async function removeContact(fieldId: string, email: string) {
  const existing = ((await session.getFormState(fieldId)) ??
    []) as OrganisationContact[];
  const newContacts = _.filter(
    existing,
    x => x.email.toLowerCase() !== email.toLowerCase(),
  );
  // if the no primary contact, make the first contact primary
  // eg when removing the primary contact
  if (newContacts.length > 0 && !newContacts.find(x => x.isPrimary)) {
    newContacts[0].isPrimary = true;
  }

  await session.setFormState(fieldId, newContacts);
  revalidatePath('/');
}

export async function setContactPrimary(fieldId: string, email: string) {
  const existing = ((await session.getFormState(fieldId)) ??
    []) as OrganisationContact[];
  const newContacts = existing.map(c => {
    if (email.toLowerCase() === c.email.toLowerCase()) {
      return { ...c, isPrimary: true };
    }
    return { ...c, isPrimary: false };
  });
  await session.setFormState(fieldId, newContacts);
  revalidatePath('/');
}
