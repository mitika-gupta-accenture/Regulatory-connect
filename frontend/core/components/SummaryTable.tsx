import { GridCol } from '@mhra/mhra-design-components';

interface SummaryTableProps {
  title: string;
  details: { label: string; value: string }[];
}

const SummaryTable = ({ title, details }: SummaryTableProps) => (
  <GridCol className="two-thirds">
    <h3 className="govuk-heading-m">{title}</h3>
    <table className="govuk-table summary-table">
      <tbody className="govuk-table__body">
        {details.map(
          (detail, index) =>
            detail.value && (
              <tr className="govuk-table__row" key={index}>
                <th className="govuk-table__header govuk-!-width-one-third">
                  {detail.label}
                </th>
                <td className="govuk-table__cell">{detail.value}</td>
              </tr>
            ),
        )}
      </tbody>
    </table>
  </GridCol>
);

export default SummaryTable;
