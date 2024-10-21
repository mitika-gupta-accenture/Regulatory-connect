"use strict";

const pa11y = require("pa11y");
const fs = require("fs");

async function runPa11y(url, area, path, actions) {
  try {
    const result = await pa11y(url + path, {
      chromeLaunchConfig: {
        args: ["--no-sandbox"],
        wait: 15000,
      },
      runners: ["axe", "htmlcs"],
      actions: actions,
      log: {
        debug: console.log,
        error: console.error,
        info: console.log,
      },
    });

    fs.writeFile(
      "results_" + area + ".json",
      JSON.stringify(result, null, 2),
      (err) => {
        if (err) throw err;
      }
    );

    if (result.issues.length > 100) {
      throw new Error(
        "Too many accessibility test failures. Number of fails: " +
          result.issues.length
      );
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

const appurl = "http://localhost:3000";

const landingPage = {
  area: "landingPage",
  path: "/",
  actions: [
    "click element #govuk-header",
    "click element #govuk-feedback-link",
    "click element #govuk-privacy-policy-link",
    "click element #crown-copyright-link",
    "click element #govuk-accessibility-statement-link",
    "click element #govuk-cookie-link",
    "click element #govuk-cookies-accept-button",
    "click element #govuk-cookies-hide-button",
    "navigate to " + appurl,
    "click element #govuk-cookies-reject-button",
    "click element #govuk-cookies-hide-button",
    "click element #govuk-button",
  ],
};

const accessibilityPage = {
  area: "accessibilityPage",
  path: "/AccessibilityStatement",
  actions: [
    "click element #govuk-ability-net-link",
    "click element #govuk-web-updates-link",
    "click element #govuk-equality-advisory-service-link",
    "click element #govuk-w3-standard-link",
  ],
};

const suspectSeller = {
  area: "suspectSellerPage",
  path: "/",
  actions: [
    "click element #govuk-cookies-accept-button",
    "click element #govuk-cookies-hide-button",
    "click element #govuk-button",
    "click element #govuk-button",
    "click element #govuk-button",
    "click element #govuk-button",
    "click element #Something\\ else",
    "click element #govuk-button",
  ],
};

const cookiePage = {
  area: "cookiePage",
  path: "/CookiesStatement",
  actions: [
    "click element #main-content",
    "click element #cookies-functional",
    "click element #cookies-functional-2",
    "click element #cookies-analytics",
    "click element #cookies-analytics-2",
    "set field #cookies-functional to Yes",
    "set field #cookies-analytics-2 to No",
    "click element #cookies-save-settings",
  ],
};

async function runAllScripts() {
  console.log("\n------------Landing Page------------\n");
  await runPa11y(
    appurl,
    landingPage.area,
    landingPage.path,
    landingPage.actions
  );
  console.log("\n------------Accessibility Page------------\n");
  await runPa11y(
    appurl,
    accessibilityPage.area,
    accessibilityPage.path,
    accessibilityPage.actions
  );
  console.log("\n------------Suspect Seller Page------------\n");
  await runPa11y(
    appurl,
    suspectSeller.area,
    suspectSeller.path,
    suspectSeller.actions
  );
  console.log("\n------------Cookie Page------------\n");
  await runPa11y(appurl, cookiePage.area, cookiePage.path, cookiePage.actions);
}

runAllScripts();
