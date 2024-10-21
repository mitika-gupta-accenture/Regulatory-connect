import React from "react";

export interface ISummaryListProps {
  summaryText?: string;
  detailsText?: string;
  summaryText1?: string;
  toolTip?: string;
  toolTip1?: string;
}

export const SummaryList = (props: ISummaryListProps) => {
  return (
    <dl className="govuk-summary-list">
      <div className="govuk-summary-list__row">
        <dt className="govuk-summary-list__key" title={props.toolTip}>
          {props.summaryText}
        </dt>
        <dd className="govuk-summary-list__value" title={props.toolTip}>
          {props.detailsText}
        </dd>
      </div>
      <div className="govuk-summary-list__row">
        <dt className="govuk-summary-list__key" title={props.toolTip1}>
          {props.summaryText1}
        </dt>
        <dd className="govuk-summary-list__value" title={props.toolTip1}>
          Mason House
          <br />
          Maynard Industrial Estate
          <br />
          Halifax <br />
          HX4 6TY <br /> UK
        </dd>
      </div>
    </dl>
  );
};
