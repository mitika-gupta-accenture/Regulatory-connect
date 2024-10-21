'use server';
import updateUserRoles from 'core/apis/cam/updateUserRole';
import { SelectedUserDetails } from 'core/models/apiModel';
import { redirect } from 'next/navigation';

export async function updateUserRoleAction(
  selectedUserDetails: SelectedUserDetails | null,
  params: { identifier: string },
  errorMessages: { roleError: string; serviceGroupError: string },
  formData: FormData,
) {
  if (!selectedUserDetails || !params || !formData) {
    throw new Error(
      `Missing required arguments selectedUserDetails: 
            ${!!selectedUserDetails}, params: ${!!params}, 
            formData: ${!!formData}`,
    );
  }
  const contributorVal = formData.get('contributor-value');
  formData.delete('contributor-value');
  const newRoles = Array.from(formData.values()) as string[];
  try {
    if (!formData.get('user-role')) {
      errorMessages.roleError = 'Select a role to assign to the user';
      errorMessages.serviceGroupError = '';
      return errorMessages;
    }

    if (formData.get('user-role') === contributorVal && newRoles.length <= 1) {
      errorMessages.roleError = '';
      errorMessages.serviceGroupError =
        'Select a Service Group to assign the user';
      return errorMessages;
    }

    const userCurrentRoles = [
      selectedUserDetails.roles.map(role => role.roleId),
      selectedUserDetails.serviceGroups.map(
        serviceGroup => serviceGroup.roleId,
      ),
    ].flat(Infinity) as string[];

    await updateUserRoles(
      newRoles,
      userCurrentRoles,
      params.identifier,
      selectedUserDetails.organisationIdentifier,
    );
  } catch (err) {
    console.error(err);
  } finally {
    if (
      (!!formData.get('user-role') &&
        formData.get('user-role') !== contributorVal) ||
      (formData.get('user-role') === contributorVal && newRoles.length > 1)
    ) {
      redirect(
        `/dashboard/account-management/change-user-details/${params.identifier}/change-user-role-confirmation`,
      );
    }
  }
  return errorMessages;
}
