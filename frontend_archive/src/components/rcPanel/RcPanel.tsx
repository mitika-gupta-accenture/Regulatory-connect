import React from "react";
import { Fieldset, FormGroup, Panel } from "govuk-react";
import Element from "../element/Element";
import { IChildrenJsonProps } from "../../core/types/common";

export interface IRcPanelProps {
  text: string;
  children?: IChildrenJsonProps[];
  visibilityCondition?: Record<string, any>;
}

export const RcPanel = React.memo((props: IRcPanelProps) => {
  return (
    <FormGroup>
      <Fieldset>
        {props.text && (
          <Fieldset.Legend>
            <Panel title={props.text}>
              <React.Fragment>
                {props.children &&
                  props.children.map(
                    (child: IChildrenJsonProps, index: number) => {
                      return <Element field={child} key={child.displayOrder} />;
                    }
                  )}
              </React.Fragment>
            </Panel>
          </Fieldset.Legend>
        )}
      </Fieldset>
    </FormGroup>
  );
});
