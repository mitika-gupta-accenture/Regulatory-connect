import React, { useEffect } from "react"
import { RcLabel } from "../rcLabel/RcLabel"
import { RcLink } from "../rcLink/RcLink"
import { GridCol, GridRow } from "govuk-react"
import { Header } from "../header/Header"
import { GridContainer } from "../grid-container/GridContainer"
import { Banner } from "../banner/Banner"
import { GridWrapper } from "../grid-wrapper/GridWrapper"
import { RcFooter } from "../footer/Footer"
import useTriggerEvents from "../../core/hooks/useTriggerEvents"
import { RcCaption } from "../rcCaption/RcCaption"
import { useSelector } from "react-redux"
import { RootState } from "../../core/store/store"

export const ChooseSubmissionType = React.memo(() => {
    const { triggerEvent } = useTriggerEvents();

    useEffect(() => {
        triggerEvent('getSubmissionTypeData');
    }, [])

    const formFieldData = useSelector(
        (state: RootState) =>
            state.applicationFormFieldsReducer.applicationFormFieldsData
    );
    const submissionTypes = formFieldData.submissionType;

    return (
        <>
            <Header />
            <GridContainer>
                <Banner />
                <GridContainer>
                    <GridWrapper>
                        <GridRow>
                            <GridCol className="govuk-grid-column-two-thirds">
                                <RcLabel text={'Choose a submission type'} className="govuk-!-margin-bottom-0" name={'ChooseSubmissionTypeLabel'} size="L" />
                                <RcCaption text="$$$" apiDataId="userData.companyAddresses.0.companyName" className="govuk-!-margin-bottom-6" name={"CompanyNameCaption"} />
                            </GridCol>
                        </GridRow>
                        {submissionTypes && (
                            <GridRow>
                                <GridCol className="govuk-grid-column-one-half">
                                    {submissionTypes.map((submissionType: { submissionTypeHeader: string; labelName: string; link: any[]; id: number }, index: number) => (
                                        <React.Fragment key={submissionType.id}>
                                            {(index % 2 === 0) && (
                                                <>
                                                    <RcLabel text={submissionType.submissionTypeHeader} size="S" name={`${submissionType.labelName}Label`} />
                                                    <RcLink text={""} apiDataId={`submissionType.${index}.link`} apiDataIdKeys={["linkDisplayText", "linkURL"]} className="govuk-submissionType-links" />
                                                    <RcLink text="$$$" apiDataId={`submissionType.${index}`} apiDataIdKeys={["guidelineLinkDisplayText", "guidelineURL"]} className="govuk-submissionType-links govuk-submissionType-sections" />

                                                </>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </GridCol>

                                <GridCol className="govuk-grid-column-one-half">
                                    {submissionTypes.map((submissionType: { submissionTypeHeader: string; labelName: string; link: any[]; id: number }, index: number) => (
                                        <React.Fragment key={submissionType.id}>
                                            {(index % 2 !== 0) && (
                                                <>
                                                    <RcLabel text={submissionType.submissionTypeHeader} size="S" name={`${submissionType.labelName}Label`} />
                                                    <RcLink text={""} apiDataId={`submissionType.${index}.link`} apiDataIdKeys={["linkDisplayText", "linkURL"]} className="govuk-submissionType-links" />
                                                    <RcLink text="$$$" apiDataId={`submissionType.${index}`} apiDataIdKeys={["guidelineLinkDisplayText", "guidelineURL"]} className="govuk-submissionType-links govuk-submissionType-sections" />
                                                </>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </GridCol>
                            </GridRow>
                        )}
                    </GridWrapper>
                </GridContainer>
            </GridContainer>
            <RcFooter />
        </>
    )
});