import React, { useEffect, useState } from "react";
import { GridContainer } from "../grid-container/GridContainer";
import { GridWrapper } from "../grid-wrapper/GridWrapper";
import { Header } from "../header/Header";
import { RcFooter } from "../footer/Footer";
import { Banner } from "../banner/Banner";
import { PrevLink } from "../link/PrevLink";
import { Section } from "../section/Section";
import useTriggerEvents from "../../core/hooks/useTriggerEvents";
import {
  IChildrenJsonProps,
  IEventConfigJsonProps,
  INestedChildrenJsonProps,
  IPageJsonProps,
  ISectionJsonProps,
} from "../../core/types/common";
import { RcButton } from "../rcButton/RcButton";
import { GridCol, GridRow } from "govuk-react";
import { getColumnClassName } from "../../core/utils/renderUtils";
import { RcErrorSummary } from "../rcErrorSummary/RcErrorSummary";
import { getRequiredComponents } from "./utils/getRequiredComponents";
import { RcLink } from "../rcLink/RcLink";

interface IPageProps {
  page: IPageJsonProps;
  pageIndex: number;

}

export const Page = React.memo((props: IPageProps) => {
  const { page, pageIndex } = props;
  const { triggerEvent } = useTriggerEvents();
  const [ requiredComponents, setRequiredComponents] = useState<(IChildrenJsonProps | INestedChildrenJsonProps)[]>([])

  useEffect(() => {
    window && window.scrollTo(0, 0);
    triggerEvent('clearFormFieldErrors')
    triggerEvent("setShowErrors", {name: "showErrors", value: false})

    setRequiredComponents(getRequiredComponents(sortedSections))
  }, [pageIndex]);

  useEffect(() => {
    page.events &&
      page.events.forEach((eventConfig: IEventConfigJsonProps) => {
        const { event, eventHandler } = eventConfig;
        if (event && event === "onLoad") {
          triggerEvent(eventHandler);
        }
      });
  }, [page.events]);

  // Sort the sections based on the displayOrder before rendering
  const sortedSections = page.sections
    ? [...page.sections].sort(
        (a: ISectionJsonProps, b: ISectionJsonProps) =>
          a.displayOrder - b.displayOrder
      )
    : [];
  const { oddColumnClassName, evenColumnClassName } = getColumnClassName(
    page.layout
  );
  return (
    <React.Fragment>
      <Header />
      <GridContainer>
        <Banner />
        {pageIndex >= 0 && page.name !=="ConfirmAnswers" && page.name !=="TailoringComplete" &&(
          <PrevLink
            className="govuk-back-link"
            eventHandler={"previousPage"}
            text={"Back"}
          />
        )}
        <RcErrorSummary requiredComponents={requiredComponents}/>
        <GridContainer>
          <GridWrapper>
            <form>
              <GridRow>
                {sortedSections.map((section: ISectionJsonProps, i: number) => {
                  return (
                    <GridCol
                      className={`${i % 2 === 0 ? oddColumnClassName : evenColumnClassName} `}
                      key={section.displayOrder}
                    >
                      <Section section={section} key={section.displayOrder} />
                    </GridCol>
                  );
                })}
              </GridRow>

              {page?.showSubmitButton && (
                <GridRow>
                  <GridCol className="full">
                    <RcButton
                      name={"continueButton"}
                      text={page.btnText ? page.btnText :"Continue"}
                      navigationCondition={page.navigationCondition}
                      specialFlowCondition={page.specialFlowCondition}
                      events={[
                        {
                          event: page.events?.[0]?.event ?? "onClick",
                          eventHandler:page.events?.[0]?.eventHandler ?? "handleConditionalNavigation" ,
                        },
                      ]}
                      requiredComponents={requiredComponents}
                    />
                  </GridCol>
                </GridRow>
              )}
              <br></br>
              {page?.backToDashboard && (
                <GridRow>
                  <GridCol className="full">
                    <RcLink
                      name={"backToDashboard"}
                      text={page?.backToDashboardText}
                      href={page?.backToDashboardHref}
                      className="govuk-body govuk-link" 
                      layout="full"
                      children={[]}
                                       
                      
                    />
                  </GridCol>
                </GridRow>
              )}
              {page?.showCancelButton && (
                <GridRow>
                  <GridCol className="full">
                    <RcButton
                      name={"cancelButton"}
                      navigationCondition={"CancelApplication"}
                      theme={"secondary"}
                      text={"Cancel application"}
                      events={[
                        {
                          event: "onClick",
                          eventHandler: "handleConditionalNavigation",
                        },
                      ]}
                    />
                  </GridCol>
                </GridRow>
              )}
            </form>
          </GridWrapper>
        </GridContainer>
      </GridContainer>
      <RcFooter />
    </React.Fragment>
  );
});
