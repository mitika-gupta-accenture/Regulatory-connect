import { FieldType } from 'core/components/FieldFactory';
import * as session from 'core/models/redis';
import AddAnotherClient from './addAnotherClient';
import { revalidatePath } from 'next/cache';
import { StateFieldType } from './actions';
import { answer } from 'core/components/Summary';
import { ApiResponseDataType } from 'core/validation/types';
import { ErrorSummaryType } from 'core/components/ErrorSummary';

export type AddAnotherType = {
  identifier: string;
  type: 'server-component';
  rule: 'add-another';
  fields: FieldType[];
};

export async function getCurrentState(
  field: FieldType,
  previousAnswers: answer[],
) {
  if ((await session.getFormState(field.identifier!)) === null) {
    await session.setFormState(field.identifier!, [field]);
  }
  const formstate = (await session.getFormState(
    field.identifier!,
  )) as StateFieldType[];

  if (previousAnswers && previousAnswers.length > 0) {
    formstate?.forEach(item => {
      if (!Object.prototype.hasOwnProperty.call(item, 'value')) {
        item['value'] = previousAnswers.find(
          answer => answer.identifier === item.identifier,
        )?.answer;
      }
    });
  }

  revalidatePath('/');
  return formstate;
}

export default async function AddAnother({
  field,
  previousAnswers,
  apiData,
  errorSummary,
}: {
  field: FieldType;
  previousAnswers: answer[];
  apiData?: ApiResponseDataType;
  errorSummary: ErrorSummaryType;
}) {
  const answers = await getCurrentState(field, previousAnswers);

  // answers = answers.map(answer => {
  //   const prevAns = previousPageAnswers?.filter(
  //     data => answer.identifier === data.identifier,
  //   )?.[0]?.answer;
  //   const resp = { ...answer, value: prevAns };
  //   return resp;
  // });

  return (
    <AddAnotherClient
      field={field}
      answers={answers}
      apiData={apiData}
      errorSummary={errorSummary}
    />
  );
}
