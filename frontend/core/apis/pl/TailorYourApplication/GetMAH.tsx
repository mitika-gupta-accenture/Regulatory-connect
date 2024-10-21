import { commonBaseUrl } from 'core/services/endPoints';
import { fetchService } from 'core/services/fetchService';

type MahApiResponse = {
  organisation: string;
  address: {
    line1: string;
    line2: string;
  };
};

export default async function GetMAH() {
  const data = (await fetchService.get(
    '89b02541-7844-47a8-a0d1-f4f5dc2356db',
    {},
    commonBaseUrl,
  )) as MahApiResponse;
  return (
    <>
      <table className="govuk-table">
        <tbody className="govuk-table__body">
          <tr className="govuk-table__row">
            <th scope="row" className="govuk-table__header">
              Organisation
            </th>
            <td className="govuk-table__cell">{data.organisation}</td>
          </tr>
          <tr className="govuk-table__row">
            <th scope="row" className="govuk-table__header">
              Address
            </th>
            <td className="govuk-table__cell">
              <ul className="govuk-list">
                {Object.values(data.address).map((line, index) => (
                  <li key={index}>{line}</li>
                ))}
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
      <input
        type="hidden"
        name="marketing-authorisation-holder"
        id="to"
        value={Object.values(data.address)}
      />
    </>
  );
}
