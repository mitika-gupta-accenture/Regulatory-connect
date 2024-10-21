import * as session from '../../../core/models/redis';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export default async function submitAnswers(prevState: FormData) {
  await session.getAllAnswers();
  console.dir(prevState, { depth: null });

  revalidatePath('/check-and-confirm-your-answers');
  redirect('tailor-your-application/application-complete');
}
