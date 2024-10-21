import React from "react";
import useNavigation from "../../core/hooks/useNavigation";
import { PrevLink } from "../link/PrevLink";

export const BackLink = () => {
  const { currentPageIndex } = useNavigation();

  return currentPageIndex > 0 ? (
    <PrevLink
      className="govuk-back-link"
      eventHandler={"previousPage"}
      text={"Back"}
    />
  ) : (
    <></>
  );
};
