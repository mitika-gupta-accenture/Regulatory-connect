import getAzureADTokenManager, { AzureADTokenManager } from "core/services/AzureADTokenManager";

jest.mock('jwt-decode', () => jest.fn());

// Mock the @azure/identity module
jest.mock('@azure/identity', () => {
    return {
        DefaultAzureCredential: jest.fn().mockImplementation(() => ({})),
    };
});

// Mock the @azure/keyvault-secrets module
jest.mock('@azure/keyvault-secrets', () => {
    return {
        SecretClient: jest.fn().mockImplementation(() => ({
            getSecret: jest.fn().mockResolvedValue({ value: 'mocked-secret-value' }),
        })),
    };
});
(global as any).fetch = jest.fn();


describe('AzureADTokenManager with Promise resolve ', () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(Promise.resolve({
        json: () => Promise.resolve({ access_token: 'mockToken' })
    }))
    beforeEach(() => {
        process.env.KEY_VAULT_NAME = 'kvrms02devuks';
        process.env.KEY_VAULT_AAD_Client_ID = 'AADClientID';
        process.env.KEY_VAULT_AAD_Client_Secret = 'AADClientSecret';
        process.env.KEY_VAULT_AAD_Tenant_ID = 'AADTenantID';
    });


    test('should retrieve and return the token using key vault credentials', async () => {
        const azureADInstance = await getAzureADTokenManager();
        const token = await azureADInstance.getApiToken();

        expect(token).toEqual('mockToken');
        expect(global.fetch).toHaveBeenCalledTimes(1);

    });
    test('should only initialize the AzureADTokenManager once (singleton)', async () => {
        const instance1 = await getAzureADTokenManager();
        const instance2 = await getAzureADTokenManager();

        expect(instance1).toBe(instance2);
        expect(global.fetch).toHaveBeenCalledTimes(1); // Ensures initialization is only called once
    });
    test('should refresh the token if it is expired', async () => {
        const mockJwtDecode = require('jwt-decode');
        mockJwtDecode.mockReturnValueOnce({ exp: Date.now() / 1000 - 3600 }); // Expired token

        const azureADInstance = await getAzureADTokenManager();
        const token = await azureADInstance.getApiToken();

        expect(global.fetch).toHaveBeenCalledTimes(1); // Once for the initial fetch, once for the refresh
        expect(token).toEqual('mockToken');
    });
    test('should not refresh the token if it is not expired', async () => {
        const mockJwtDecode = require('jwt-decode');
        mockJwtDecode.mockReturnValueOnce({ exp: Date.now() / 1000 + 3600 }); // Valid token

        const azureADInstance = await getAzureADTokenManager();
        const token = await azureADInstance.getApiToken();

        expect(global.fetch).toHaveBeenCalledTimes(1); // Only the initial fetch
        expect(token).toEqual('mockToken');
    });

    test('should refresh token if apiToken is expired', async () => {
        // Mock expired token
        const mockOldToken = 'expiredToken';
        const mockNewToken = 'newToken';

        const mockInitialize: any = jest.spyOn(AzureADTokenManager.prototype, 'initialize');
        mockInitialize.mockImplementation(async function (this: AzureADTokenManager) {
            // Simulate token refresh
            this['apiToken'] = mockNewToken;
            this['tokenExpireTime'] = Date.now() + 3600 * 1000; // Set a new expiration time
        });


        // Set up mock for getApiToken
        const azureADInstance = await getAzureADTokenManager();
        azureADInstance['apiToken'] = mockOldToken;
        azureADInstance['tokenExpireTime'] = Date.now() - 3600 * 1000; // 1 hour ago, token is expired

        const token = await azureADInstance.getApiToken();
        expect(token).toEqual("newToken");
        expect(mockInitialize).toHaveBeenCalledTimes(1); // Ensure refreshAccessToken was called
    });
})
