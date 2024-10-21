import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { ReactPlugin } from "@microsoft/applicationinsights-react-js";
import dotenv from "dotenv";

dotenv.config();

const reactPlugin = new ReactPlugin();
const appInsights = new ApplicationInsights({
  config: {
    connectionString:
      process.env.NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING ||
      "InstrumentationKey=__APPINSIGHTS_CONNECTION_STRING__",
    enableAutoRouteTracking: true,
    extensions: [reactPlugin],
  },
});
appInsights.loadAppInsights();

appInsights.addTelemetryInitializer((envelope) => {
  envelope.tags["ai.cloud.role"] = "eligibility-checker";
  envelope.tags["ai.cloud.roleInstance"] = "eligibility-checker";
});

export { reactPlugin, appInsights };
