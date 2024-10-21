import { DefaultAzureCredential } from '@azure/identity';
import { jwtDecode } from 'jwt-decode';
import { SecretClient } from '@azure/keyvault-secrets';

export class AzureADTokenManager {
  private static instance: AzureADTokenManager;
  private credential: DefaultAzureCredential;
  private vaultName: string;
  private url: string;
  private AADClientIDName: string;
  private AADClientSecretName: string;
  private AADTenantIDName: string;
  private apiToken: string | null;
  private tokenExpireTime: number | null;

  private constructor() {
    this.credential = new DefaultAzureCredential();
    this.vaultName = process.env.KEY_VAULT_NAME!;
    this.url = `https://${this.vaultName}.vault.azure.net`;
    this.AADClientIDName = 'AAD-CLIENTID';
    this.AADClientSecretName = 'AAD-CLIENTSECRET';
    this.AADTenantIDName = 'AAD-TENANTID';
    this.apiToken = null;
    this.tokenExpireTime = null;
  }

  public static async getInstance(): Promise<AzureADTokenManager> {
    if (!AzureADTokenManager.instance) {

      AzureADTokenManager.instance = new AzureADTokenManager();
      await AzureADTokenManager.instance.initialize();
    }
    return AzureADTokenManager.instance;
  }

  public async initialize() {
    try {
      const client = new SecretClient(this.url, this.credential);
      const AADClientID = await client.getSecret(this.AADClientIDName);
      const AADClientSecret = await client.getSecret(this.AADClientSecretName);
      const AADTenantID = await client.getSecret(this.AADTenantIDName);

      const tokenUrl = `https://login.microsoftonline.com/${AADTenantID.value}/oauth2/token`;
      const form = new FormData();
      form.append('grant_type', 'client_credentials');
      form.append('client_id', AADClientID.value!);
      form.append('client_secret', AADClientSecret.value!);

      const res = await fetch(tokenUrl, {
        method: 'POST',
        body: form,
      });

      const data = await res.json();
      if (data.access_token) {
        this.apiToken = data.access_token;
        const decoded: any = jwtDecode(data.access_token);
        this.tokenExpireTime = decoded.exp * 1000

      } else {
        throw new Error('Failed to retrieve access token');
      }
    } catch (err) {
      console.log('Error during initialization:', err);
    }
  }

  public async getApiToken() {
    // check token is expire or not
    if (this.tokenExpireTime && this.tokenExpireTime < Date.now()) {
      await this.refreshAccessToken()
    }
    return this.apiToken;
  }

  private async refreshAccessToken() {
    console.log('Refreshing access token...');
    await this.initialize();
  }

}

let tokenManagerPromise: Promise<AzureADTokenManager> | null = null;
async function getAzureADTokenManager(): Promise<AzureADTokenManager> {
  if (!tokenManagerPromise) {
    tokenManagerPromise = AzureADTokenManager.getInstance();
  }
  return tokenManagerPromise;
}

export default getAzureADTokenManager;
