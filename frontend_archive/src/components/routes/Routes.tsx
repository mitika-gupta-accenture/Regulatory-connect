import React from "react"; 
import { Route, Navigate, Routes } from "react-router-dom";
import { Page } from "../page/Page";
import PageJSON from "../../configuration/tailorYourApp.json";
import { IPageJsonProps } from "../../core/types/common";
import { CancelApp } from "../static/CancelApp";
import { ChooseSubmissionType } from "../static/ChooseSubmissionType";
import { ROUTE_NAMES } from "../../core/constants/routes";

const PageRoutesAndNavigation = React.memo(() => {
  const staticRoutes = (name: string) => {
    if (name === ROUTE_NAMES.STATIC_CANCEL_APP) {
      return <CancelApp />;
    } else if (name === ROUTE_NAMES.CHOOSE_SUBMISSION_TYPE){
      return <ChooseSubmissionType />
    }
  };

  const pageRoutes = [
    <Route
      key={0}
      path="/"
      element={<Navigate replace to={`/${PageJSON.pages[0].name}`} />}
    />
  ];

  PageJSON.pages.forEach((page: IPageJsonProps, index: number) => {
    // Add a default value false for static route to each page object
    page.staticRoute = page.staticRoute || false;
    pageRoutes.push(
      <Route
        key={page.name}
        path={`/${page.name}`}
        element={
          page.staticRoute ? (staticRoutes(page.name)) : (
            <Page page={page} pageIndex={index} />
          )
        }
      />
    );
  });

  return (
    <React.Fragment>
      <Routes>{pageRoutes}</Routes>
    </React.Fragment>
  );
});

export default PageRoutesAndNavigation;
