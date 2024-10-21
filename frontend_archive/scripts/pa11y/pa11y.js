const fs = require('fs');
const path = require('path');
const pa11y = require('pa11y');
const url = require('url');
const PageJSON = require("../../src/configuration/tailorYourApp.json");
require('dotenv').config({ path: process?.argv?.[2] ?? "../../.env.development" });

const baseUrl = process.env.REACT_APP_BASE_URL;
async function checkAccessibilityIssues() {
    const accessibilityResults = [];
    for (const pageKey in PageJSON.pages) {
        if (Object.hasOwnProperty.call(PageJSON.pages, pageKey)) {
            const page = PageJSON.pages[pageKey];
            try {
                const pageUrl = url.resolve(baseUrl, page.name);
                const results = await pa11y(pageUrl, {
                    includeNotices: false,
                    includeWarnings: false,
                    includeErrors: true,
                    runners: ["axe", "htmlcs"],
                    standard: "WCAG2AAA",
                    level: 'error',
                    ignore: [
                        "color-contrast",
                        "frame-tested",
                        "WCAG2AAA.Principle1.Guideline1_4.1_4_6.G17.Fail"
                    ],
                });
                accessibilityResults.push({
                    page: page.name,
                    results: results
                });
            } catch (error) {
                console.error(`Error testing accessibility for ${page.name}:`, error);
            }
        }
    }

    // Write results to a JSON file
    const resultsFilePath = path.join(__dirname, 'results.json');
    fs.writeFileSync(resultsFilePath, JSON.stringify(accessibilityResults, null, 2));

    console.log('Accessibility test results written to:', resultsFilePath);
}

checkAccessibilityIssues();