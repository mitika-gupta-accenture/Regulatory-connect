import React from "react";
import { Table } from "govuk-react";
import { IChildrenJsonProps } from "../../core/types/common";
import Element from "../element/Element";
import useConditionEvaluator from "../../core/hooks/useConditionEvaluator";

export interface IRcTableProps {
  children: IChildrenJsonProps[];
  className?: string;
  text: string;
}

export const RcTable = React.memo(
  ({ children, text, className = "" }: IRcTableProps) => {
    const { evaluateFieldValueExists } = useConditionEvaluator();
    const getTableHeaders = () => {
      const tableHeader = children[0].columns;
      return (
        <Table.Row>
          {tableHeader?.map((column: string[], index: number) => {
            return <Table.CellHeader key={column}>{column}</Table.CellHeader>;
          })}
        </Table.Row>
      );
    };

    const getTableBody = () => {
      const tableBody = children[1].rows;
      return tableBody?.map((row: any, index: number) => {
        if (
          !row.visibilityFieldsCheck ||
          (row.visibilityFieldsCheck &&
            evaluateFieldValueExists(row.visibilityFieldsCheck))
        ) {
          return (
            <Table.Row key={row} className="govuk-summary-list__row">
              {row.tableRow.map((column: any, idx: number) => {
                if (idx === 0) {
                  return (
                    <Table.CellHeader key={column}>
                      {column.children.map((child: any, id: number) => {
                        return (
                          <Element
                            key={child}
                            field={{ ...child, isBold: true }}
                          />
                        );
                      })}
                    </Table.CellHeader>
                  );
                } else {
                  return (
                    <Table.Cell key={column}>
                      {column.children.map((child: any, id: number) => {
                        return (
                          <Element
                            key={child}
                            field={{
                              ...child,
                              className: "govuk-!-margin-bottom-0",
                            }}
                          />
                        );
                      })}
                    </Table.Cell>
                  );
                }
              })}
            </Table.Row>
          );
        }
        return <></>;
      });
    };

    return (
      <React.Fragment>
        <Table caption={text} head={getTableHeaders()}>
          {getTableBody()}
        </Table>
      </React.Fragment>
    );
  }
);
