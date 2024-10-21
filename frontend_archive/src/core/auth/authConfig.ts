import { LogLevel } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: "f925d465-e455-44a3-a5d1-0164dc6007f3", // This is the ONLY mandatory field that you need to supply.
    authority:
      "https://login.microsoftonline.com/AccentureInternal2023.onmicrosoft.com", // Defaults to 'https://login.microsoftonline.com/common'
    redirectUri: "/", // Points to window.location.origin. You must register this URI on Azure Portal/App Registration.
    postLogoutRedirectUri: "/", // Indicates the page to navigate after logout.
    navigateToLoginRequestUrl: false, // If 'true', will navigate back to the original request location before processing the auth code response.
  },
  cache: {
    cacheLocation: "sessionStorage", // Configures cache location. 'sessionStorage' is more secure, but 'localStorage' gives you SSO between tabs.
    storeAuthStateInCookie: false, // Set this to 'true' if you are having issues on IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback: (
        level: LogLevel,
        message: string,
        containsPii: boolean
      ) => {
        if (containsPii) {
          return false;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
          default:
            return;
        }
      },
    },
  },
};

export const loginRequest = {
  scopes: ["api://f925d465-e455-44a3-a5d1-0164dc6007f3/User.Read"],
};

export const silentRequest = {
  scopes: ["openid", "profile"],
  loginHint: "example@domain.net",
};
