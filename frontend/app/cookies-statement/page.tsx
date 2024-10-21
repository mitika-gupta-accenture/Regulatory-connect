'use client';
import React, { useState } from 'react';
import { GridWrapper, GridCol, GridRow } from '@mhra/mhra-design-components';

export default function CookiesStatement() {
  const [showNotification, setShowNotification] = useState(false);

  const handleNotification = () => {
    setShowNotification(true);
  };

  return (
    <GridWrapper>
      <GridRow>
        <GridCol className="two-thirds">
          <div id="main-content">
            <br />
            <h1 className="govuk-heading-xl">Cookies</h1>
            {showNotification && (
              <div
                className="govuk-notification-banner govuk-notification-banner--success"
                role="alert"
                aria-labelledby="govuk-notification-banner-title"
                data-module="govuk-notification-banner"
              >
                <div className="govuk-notification-banner__header">
                  <h2
                    className="govuk-notification-banner__title"
                    id="govuk-notification-banner-title"
                  >
                    Success
                  </h2>
                </div>
                <div className="govuk-notification-banner__content">
                  <p className="govuk-notification-banner__heading">
                    You’ve set your cookie preferences.{' '}
                    <a className="govuk-notification-banner__link" href="/">
                      Go back to the page you were looking at
                    </a>
                    .
                  </p>
                </div>
              </div>
            )}
            <p className="govuk-body">
              This service puts small files (known as ‘cookies’) onto your
              computer in order to:
            </p>
            <ul className="govuk-list govuk-list--bullet">
              <li>
                remember what messages you’ve seen so you’re not shown them
                again
              </li>
              <li>
                understand how you use the service so we can update and improve
                it
              </li>
              <li>
                temporarily store information you enter to support your
                application
              </li>
            </ul>
            <div className="govuk-inset-text">
              The cookies we use don’t identify you personally.
            </div>
            <h2 className="govuk-heading-l">Introductory cookie message</h2>
            <p className="govuk-body">
              When you first use the service we show a ‘cookie message’. We then
              store a cookie on your computer so it knows not to show this
              message again.
            </p>
            <div className="govuk-tabs" data-module="govuk-tabs">
              <div className="govuk-tabs__panel" id="past-day">
                <table className="govuk-table">
                  <thead className="govuk-table__head">
                    <tr className="govuk-table__row">
                      <th scope="col" className="govuk-table__header">
                        Name
                      </th>
                      <th scope="col" className="govuk-table__header">
                        Purpose
                      </th>
                      <th scope="col" className="govuk-table__header">
                        Expires
                      </th>
                    </tr>
                  </thead>
                  <tbody className="govuk-table__body">
                    <tr className="govuk-table__row">
                      <td className="govuk-table__cell">seen_cookie_message</td>
                      <td className="govuk-table__cell">
                        Lets us know you’ve already seen our cookie message
                      </td>
                      <td className="govuk-table__cell">1 month</td>
                    </tr>
                    <tr className="govuk-table__row">
                      <td className="govuk-table__cell">cookie_preferences</td>
                      <td className="govuk-table__cell">
                        {' '}
                        Lets us know that you’ve saved your cookie consent
                        settings
                      </td>
                      <td className="govuk-table__cell">1 month</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <h2 className="govuk-heading-l">Session cookies</h2>
            <p className="govuk-body">
              Session cookies are downloaded each time you visit the service and
              deleted when you close your browser. They help the service to work
              properly.
            </p>
            <div className="govuk-tabs" data-module="govuk-tabs">
              <div className="govuk-tabs__panel" id="past-day">
                <table className="govuk-table">
                  <thead className="govuk-table__head">
                    <tr className="govuk-table__row">
                      <th scope="col" className="govuk-table__header">
                        Name
                      </th>
                      <th scope="col" className="govuk-table__header">
                        Purpose
                      </th>
                      <th scope="col" className="govuk-table__header">
                        Expires
                      </th>
                    </tr>
                  </thead>
                  <tbody className="govuk-table__body">
                    <tr className="govuk-table__row">
                      <td className="govuk-table__cell">session_cookie</td>
                      <td className="govuk-table__cell">
                        Stores a session ID and temporarily stores data you
                        enter to enable you to make an application
                      </td>
                      <td className="govuk-table__cell">
                        After 10 minutes of inactivity
                      </td>
                    </tr>
                    <tr className="govuk-table__row">
                      <td className="govuk-table__cell">session_valid</td>
                      <td className="govuk-table__cell">
                        {' '}
                        Ensures you have a valid session ID
                      </td>
                      <td className="govuk-table__cell">
                        When you close your browser
                      </td>
                    </tr>
                    <tr className="govuk-table__row">
                      <td className="govuk-table__cell">cookie_check</td>
                      <td className="govuk-table__cell">
                        {' '}
                        Tells us you have already allowed cookies so we don’t
                        need to ask you again
                      </td>
                      <td className="govuk-table__cell">
                        When you close your browser
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </GridCol>
        <GridRow>
          <GridCol className="two-thirds">
            <h2 className="govuk-heading-l">Change your cookie settings</h2>

            <div className="govuk-form-group">
              <fieldset className="govuk-fieldset">
                <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
                  Do you want to accept functional cookies?
                </legend>
                <div className="govuk-radios" data-module="govuk-radios">
                  <div className="govuk-radios__item">
                    <input
                      className="govuk-radios__input"
                      id="cookies-functional"
                      name="cookies[functional]"
                      type="radio"
                      value="yes"
                    ></input>
                    <label
                      className="govuk-label govuk-radios__label"
                      htmlFor="cookies-functional"
                    >
                      Yes
                    </label>
                  </div>
                  <div className="govuk-radios__item">
                    <input
                      className="govuk-radios__input"
                      id="cookies-functional-2"
                      name="cookies[functional]"
                      type="radio"
                      value="no"
                      defaultChecked
                    ></input>
                    <label
                      className="govuk-label govuk-radios__label"
                      htmlFor="cookies-functional-2"
                    >
                      No
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>
            <div className="govuk-form-group">
              <fieldset className="govuk-fieldset">
                <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
                  Do you want to accept analytics cookies?
                </legend>
                <div className="govuk-radios" data-module="govuk-radios">
                  <div className="govuk-radios__item">
                    <input
                      className="govuk-radios__input"
                      id="cookies-analytics"
                      name="cookies[analytics]"
                      type="radio"
                      value="yes"
                    ></input>
                    <label
                      className="govuk-label govuk-radios__label"
                      htmlFor="cookies-analytics"
                    >
                      Yes
                    </label>
                  </div>
                  <div className="govuk-radios__item">
                    <input
                      className="govuk-radios__input"
                      id="cookies-analytics-2"
                      name="cookies[analytics]"
                      type="radio"
                      value="no"
                      defaultChecked
                    ></input>
                    <label
                      className="govuk-label govuk-radios__label"
                      htmlFor="cookies-analytics-2"
                    >
                      No
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>
            <button
              type="submit"
              className="govuk-button"
              id="cookies-save-settings"
              data-module="govuk-button"
              onClick={handleNotification}
            >
              Save cookie settings
            </button>
          </GridCol>
        </GridRow>
      </GridRow>
    </GridWrapper>
  );
}
