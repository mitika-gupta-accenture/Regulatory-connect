import React from "react"
import { RcParagraph } from "../rcParagraph/RcParagraph"
import { RcLabel } from "../rcLabel/RcLabel"
import { Button } from "govuk-react"
import { Header } from "../header/Header"
import { GridContainer } from "../grid-container/GridContainer"
import { Banner } from "../banner/Banner"
import { GridWrapper } from "../grid-wrapper/GridWrapper"
import { RcFooter } from "../footer/Footer"
import { PrevLink } from "../link/PrevLink"

export const CancelApp = React.memo(() => {
    return (
        <>  
        <Header />
        <GridContainer>
            <Banner />
            <GridContainer>
                <GridWrapper>
                    <RcLabel text={'Cancel your application'} name={'CancelAppLabel'} />
                    <RcParagraph text={'If you cancel your application all the information you have entered will be lost.'} 
                    className="govuk-body govuk-!-margin-bottom-9"/>
                    <RcParagraph text={'Are you sure you want to cancel your application?'} />
                    <Button buttonColour={'#d4341c'} className='govuk-!-margin-bottom-6'>Cancel application</Button>
                    <br></br>
                    <PrevLink eventHandler="previousPage" className="" text="Back to previous page" />
                </GridWrapper>
            </GridContainer>   
        </GridContainer>
        <RcFooter />
        </>
    )

})