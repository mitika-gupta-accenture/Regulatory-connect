'use client';

export default function Page() {
  return (
    <>
      <p>
        Your invitation has been submitted. An email has been sent to the user
      </p>
      <table className="govuk-table">
        <tbody className="govuk-table__body">
          <tr className="govuk-table__row">
            <th
              scope="row"
              className="govuk-table__header"
              style={{ fontWeight: 'normal' }}
            >
              Role
            </th>
            <td className="govuk-table__cell">Loading...</td>
          </tr>
          <tr className="govuk-table__row">
            <th
              scope="row"
              className="govuk-table__header"
              style={{ fontWeight: 'normal' }}
            >
              User name
            </th>
            <td className="govuk-table__cell">Loading...</td>
          </tr>
          <tr className="govuk-table__row">
            <th
              scope="row"
              className="govuk-table__header"
              style={{ fontWeight: 'normal' }}
            >
              Email
            </th>
            <td className="govuk-table__cell">Loading...</td>
          </tr>
          <tr className="govuk-table__row">
            <th
              scope="row"
              className="govuk-table__header"
              style={{ fontWeight: 'normal' }}
            >
              Associated organisation
            </th>
            <td className="govuk-table__cell">Loading...</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
