import React, { useEffect, useState } from "react";
import { GridRow } from "../grid-row/GridRow";
import Element from "../element/Element";
import { IChildrenJsonProps, ISectionJsonProps } from "../../core/types/common";

export interface ISectionProps {
  section: ISectionJsonProps;
}

export const Section = React.memo((props: ISectionProps) => {
  const sectionContent = props.section;
  const [sortedChildren, setSortedChildren] = useState([
    ...sectionContent.children,
  ]);

  useEffect(() => {
    // Sort the children based on the displayOrder before rendering
    setSortedChildren(
      sectionContent.children
        ? [...sectionContent.children].sort(
            (a: IChildrenJsonProps, b: IChildrenJsonProps) =>
              a.displayOrder - b.displayOrder
          )
        : []
    );
  }, [sectionContent.children]);

  return (
    <GridRow>
      {sortedChildren &&
        sortedChildren.map((elem: IChildrenJsonProps, i: number) => {
          return (
            <Element
              field={elem}
              key={elem.name}
              layout={elem.layout || "two-thirds"}
            />
          );
        })}
    </GridRow>
  );
});