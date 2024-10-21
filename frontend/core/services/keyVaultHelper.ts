import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

export function getClient() {
  const credential = new DefaultAzureCredential();
  const vaultName = process.env.KEY_VAULT_NAME;
  const url = `https://${vaultName}.vault.azure.net`;
  return new SecretClient(url, credential);
}

export async function getSecretValue(secretName: any) {
  const client = getClient();
  const secret = await client.getSecret(secretName);
  return secret.value;
}