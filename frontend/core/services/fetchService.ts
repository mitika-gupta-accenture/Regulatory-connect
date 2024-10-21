export interface FetchOptions extends RequestInit {
  params?: Record<string, any>;
}

export interface FetchUrlOptions {
  url: string;
  options: FetchOptions;
}

export interface RequestType {
  endpoint: string;
  options: FetchOptions;
  apiBaseUrl?: string;
}

export async function fetchData<T>(
  url: string,
  options: FetchOptions = {},
): Promise<T> {
  const { params, ...restOptions } = options;
  const queryString = params
    ? `?${new URLSearchParams(params).toString()}`
    : '';

  try {
    const response = await fetch(`${url}${queryString}`, restOptions);

    if (!response.ok) {
      const errorText = `HTTP error! status: ${response.status}, statusText: ${response.statusText}, url: ${response.url}`;
      throw new Error(errorText);
    }

    return await response.json();
  } catch (error: any) {
    throw error; // Re-throw the error to be handled by the calling code
  }
}

export async function fetchCollectionData<T>(
  requests: FetchUrlOptions[],
): Promise<T[]> {
  try {
    const promises = requests.map(({ url, options }) =>
      fetchData<T>(url, options),
    );

    return await Promise.all(promises);
  } catch (error: any) {
    throw error; // Re-throw the error to be handled by the calling code
  }
}

export const fetchService = {
  get: async function (
    endpoint: string,
    options: FetchOptions = {},
    apiBaseUrl?: string,
  ): Promise<object> {
    return fetchData(`${apiBaseUrl ? `${apiBaseUrl}` : ''}${endpoint}`, {
      method: 'GET',
      ...options,
    });
  },

  post: async function (
    endpoint: string,
    options: FetchOptions = {},
    apiBaseUrl?: string,
  ): Promise<object> {
    return fetchData(`${apiBaseUrl ? `${apiBaseUrl}` : ''}${endpoint}`, {
      method: 'POST',
      ...options,
    });
  },

  getCollection: async function (requests: RequestType[]): Promise<object[]> {
    const fetchRequests = requests.map(({ endpoint, options, apiBaseUrl }) => ({
      url: `${apiBaseUrl ? `${apiBaseUrl}` : ''}${endpoint}`,
      options: {
        method: 'GET',
        ...options,
      },
    }));

    return fetchCollectionData(fetchRequests);
  },

  postCollection: async function (requests: RequestType[]): Promise<object[]> {
    const fetchRequests = requests.map(({ endpoint, options, apiBaseUrl }) => ({
      url: `${apiBaseUrl ? `${apiBaseUrl}/` : ''}${endpoint}`,
      options: {
        method: 'POST',
        ...options,
      },
    }));

    return fetchCollectionData(fetchRequests);
  },
};
