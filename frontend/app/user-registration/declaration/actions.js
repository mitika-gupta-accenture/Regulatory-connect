'use server';
import { redirect } from 'next/navigation';
import insertUserDetails from 'core/apis/cam/CreateUser';

export const continueDeclarationForm = async (prevState, queryData) => {
  const userDetails = prevState.userDetails;
  const userInput = await queryData.getAll('declaration');
  const declarationAccepted = userInput.length === 2;
  if (declarationAccepted) {
    insertUserDetails(userDetails);
    redirect('/user-registration/sign-up-confirmation');
  }
  return { valid: declarationAccepted, userDetails: userDetails };
};
