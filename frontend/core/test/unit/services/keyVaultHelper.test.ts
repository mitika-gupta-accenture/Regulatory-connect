import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';
import { getClient, getSecretValue } from 'core/services/keyVaultHelper';

jest.mock('@azure/identity', () => ({
  DefaultAzureCredential: jest.fn(),
}));

jest.mock('@azure/keyvault-secrets', () => ({
  SecretClient: jest.fn(() => ({
    getSecret: jest.fn(),
  })),
}));

describe('Key Vault Secret Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getClient', () => {
    it('should create a SecretClient with the correct URL and credentials', () => {
      const mockVaultName = 'test-vault';
      process.env.KEY_VAULT_NAME = mockVaultName;

      const client = getClient();

      expect(DefaultAzureCredential).toHaveBeenCalled();
      expect(SecretClient).toHaveBeenCalledWith(
        `https://${mockVaultName}.vault.azure.net`,
        expect.any(DefaultAzureCredential)
      );
    });
  });

  describe('getSecretValue', () => {
    it('should return the secret value when getSecret is successful', async () => {
      const mockSecretName = 'test-secret';
      const mockSecretValue = 'secret-value';
      (SecretClient as any).mockImplementationOnce(() => ({
        getSecret: jest.fn().mockResolvedValue({
          value: mockSecretValue,
        }),
      }));

      const result = await getSecretValue(mockSecretName);

      expect(SecretClient).toHaveBeenCalled();
      expect(result).toBe(mockSecretValue);
    });

    it('should handle errors when getSecret fails', async () => {
      const mockSecretName = 'test-secret';
      const mockError = new Error('Failed to get secret');

      (SecretClient as any).mockImplementationOnce(() => ({
        getSecret: jest.fn().mockRejectedValue(mockError),
      }));

      await expect(getSecretValue(mockSecretName)).rejects.toThrow('Failed to get secret');
    });
  });
});