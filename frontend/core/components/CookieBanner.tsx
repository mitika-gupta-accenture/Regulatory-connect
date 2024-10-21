'use client';

import React, { useEffect, useState } from 'react';
import { Conditional } from './Conditional';
import { GridContainer, GridWrapper, GridCol, GridRow, Heading, Paragraph, Button } from '@mhra/mhra-design-components';

function CookieBanner() {
  const [jsEnabled, setJsEnabled] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [showAcceptedMessage, setShowAcceptedMessage] = useState(false);
  const [showRejectedMessage, setShowRejectedMessage] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  useEffect(() => {
    setJsEnabled(true);
  }, []);

  useEffect(() => {
    setJsEnabled(true);
    const cookieAccepted = localStorage.getItem('cookieAccepted');

    setShowBanner(!cookieAccepted);
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem('cookieAccepted', 'true');
    setShowBanner(false);
    setShowAcceptedMessage(true);
    setShowRejectedMessage(false);
    setShowMessage(true);
  };

  const handleRejectCookies = () => {
    localStorage.setItem('cookieAccepted', 'false');
    setShowBanner(false);
    setShowAcceptedMessage(false);
    setShowRejectedMessage(true);
    setShowMessage(true);
  };

  const closeCookieBanner = () => {
    setShowBanner(false);
    setShowAcceptedMessage(false);
    setShowRejectedMessage(false);
    setShowMessage(false);
  };

  if (jsEnabled) {
    return (
      <div>
        <Conditional showWhen={showBanner}>
          <div
            className="govuk-cookie-banner"
            data-nosnippet
            role="region"
            aria-label="Cookies on [name of service]"
          >
            <div className="govuk-cookie-banner__message govuk-width-container">
              <GridRow>
                <GridCol className='two-thirds'>
                  <Heading className="govuk-cookie-banner__heading govuk-heading-m" text='Cookies on Medicines Website Checker' size='m' />

                  <div className="govuk-cookie-banner__content">
                    <Paragraph text='We use some essential cookies to make this service work.' id='' className="govuk-body" />
                    <Paragraph text='We’d also like to use analytics cookies so we can
                      understand how you use the service and make improvements.'  id='' className="govuk-body" />
                  </div>
                </GridCol>
              </GridRow>
              <div className="govuk-button-group">
                <Button 
                id="govuk-cookies-accept-button"
                className="govuk-button"
                data-cy="govuk-cookies-accept-button"
                data-module="govuk-button"
                onClick={handleAcceptCookies}
                text={'Accept analytics cookies'} 
                />
                <Button
                  id="govuk-cookies-reject-button"
                  className="govuk-button"
                  data-cy="govuk-cookies-reject-button"
                  data-module="govuk-button"
                  onClick={handleRejectCookies}
                  text={'Reject analytics cookies'} />
                <a
                  className="govuk-link"
                  href="/cookies-statement"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeCookieBanner}
                >
                  View cookies
                </a>
              </div>
            </div>
          </div>
        </Conditional>

        <Conditional showWhen={showMessage}>
          <div
            className="govuk-cookie-banner__message govuk-width-container"
            role="alert"
          >
            <GridRow>
              <GridCol className='two-thirds'>
                <div className="govuk-cookie-banner__content">
                  <p className="govuk-body">
                    <Conditional showWhen={showAcceptedMessage}>
                      You’ve accepted analytics cookies.
                    </Conditional>
                    <Conditional showWhen={showRejectedMessage}>
                      You’ve rejected analytics cookies.
                    </Conditional>{' '}
                    You can{' '}
                    <a className="govuk-link" href="#">
                      change your cookie settings
                    </a>{' '}
                    at any time.
                  </p>
                </div>
              </GridCol>
            </GridRow>
            <div className="govuk-button-group">
              <Button
                id="govuk-cookies-hide-button"
                className="govuk-button"
                data-cy="govuk-cookies-hide-button"
                data-module="govuk-button"
                onClick={closeCookieBanner}
                text={'Hide cookie message'}
              />
            </div>
          </div>
        </Conditional>
      </div>
    );
  }
}

export default CookieBanner;
