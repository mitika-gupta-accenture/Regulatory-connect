import {
  PublicClientApplication,
  InteractionRequiredAuthError,
  EventMessage,
} from "@azure/msal-browser";
import { loginRequest, msalConfig } from "./authConfig";

export const msalInstance = new PublicClientApplication(msalConfig);

// Default to using the first account if no account is active on page load
const accounts = msalInstance.getAllAccounts();
if (!msalInstance.getActiveAccount() && accounts.length > 0) {
  // Account selection logic is app dependent. Adjust as needed for different use cases.
  msalInstance.setActiveAccount(accounts[0]);
}

// This will update account state if a user signs in from another tab or window
msalInstance.enableAccountStorageEvents();

// Listen for sign-in event and set active account
msalInstance.addEventCallback((event: EventMessage) => {});

export const getAccessToken = async () => {
  const activeAccount = msalInstance.getActiveAccount();
  const accounts = msalInstance.getAllAccounts();
  const request = {
    scopes: loginRequest.scopes,
    account: activeAccount || accounts[0],
  };

  if (!activeAccount && accounts.length === 0) {
    // No active account, acquire with interaction.
    await msalInstance.acquireTokenRedirect(request);
  } else {
    console.log("msalInstance: ", msalInstance);
    const tokenResponse = await msalInstance
      .acquireTokenSilent(request)
      .catch((error) => {
        //Handle where refresh token cannot be used to silently aqcuire access token
        if (error instanceof InteractionRequiredAuthError) {
          //Fallback to interaction
          return msalInstance.acquireTokenRedirect(request);
        }
        console.log(error);
      });
    if (tokenResponse && tokenResponse.idToken) {
      return tokenResponse.idToken;
    } else {
      console.log("Failure acquiring access token.");
    }
  }
};
