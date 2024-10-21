import { SearchUserActionReturnType } from 'app/dashboard/account-management/add-user/page';

export const AddUserSearchResult = ({
  searchedUser,
  confirmed,
}: {
  searchedUser: SearchUserActionReturnType;
  confirmed: boolean;
}) => {
  if (searchedUser.searchPerformed) {
    if (searchedUser.foundAccount) {
      return (
        <table className="govuk-table">
          {!confirmed && (
            <caption
              className="govuk-table__caption govuk-!-margin-bottom-3 govuk-!-margin-top-7"
              style={{ fontWeight: 'normal', color: 'black' }}
            >
              Check that it is the correct person.
            </caption>
          )}
          <tbody className="govuk-table__body">
            <tr className="govuk-table__row">
              <th
                scope="row"
                className="govuk-table__header"
                style={{ fontWeight: 'normal' }}
              >
                User name
              </th>
              <td className="govuk-table__cell">{searchedUser.userName}</td>
            </tr>
            <tr className="govuk-table__row">
              <th
                scope="row"
                className="govuk-table__header"
                style={{ fontWeight: 'normal' }}
              >
                Email
              </th>
              <td className="govuk-table__cell">{searchedUser.email}</td>
            </tr>
          </tbody>
        </table>
      );
    } else {
      return (
        <div className="inset-error">
          <h2 className="govuk-heading-m">No results</h2>
          <p className="govuk-body">
            You need to invite the user to register for a RegulatoryConnect
            account
          </p>
        </div>
      );
    }
  }
  return <></>;
};
