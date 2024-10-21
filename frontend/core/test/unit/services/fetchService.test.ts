import {
  fetchData,
  fetchCollectionData,
  fetchService,
  FetchUrlOptions,
  RequestType,
} from '../../../services/fetchService';

// Mocking the global fetch function
(global as any).fetch = jest.fn();

describe('fetchData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should correctly format URL with query parameters and call fetch', async () => {
    const mockResponse = { data: 'test' };
    const fetchResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    };
    (global.fetch as jest.Mock).mockResolvedValue(fetchResponse);

    const result = await fetchData('http://example.com', {
      params: { key1: 'value1', key2: 'value2' },
    });

    expect(global.fetch).toHaveBeenCalledWith(
      'http://example.com?key1=value1&key2=value2',
      expect.any(Object),
    );
    expect(result).toEqual(mockResponse);
  });

  it('should handle an HTTP error by throwing an error with a detailed message', async () => {
    const fetchResponse = {
      ok: false,
      status: 404,
      statusText: 'Not Found',
      url: 'http://example.com',
    };
    (global.fetch as jest.Mock).mockResolvedValue(fetchResponse);

    await expect(fetchData('http://example.com')).rejects.toThrow(
      'HTTP error! status: 404, statusText: Not Found, url: http://example.com',
    );
  });

  it('should rethrow any error that occurs during fetch', async () => {
    const errorMessage = 'Network error';
    (global.fetch as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await expect(fetchData('http://example.com')).rejects.toThrow(errorMessage);
  });
});

describe('fetchCollectionData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should correctly fetch data from multiple URLs', async () => {
    const mockResponses = [{ data: 'test1' }, { data: 'test2' }];
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponses[0]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponses[1]),
      });

    const requests: FetchUrlOptions[] = [
      { url: 'http://example.com/1', options: {} },
      { url: 'http://example.com/2', options: {} },
    ];

    const results = await fetchCollectionData(requests);

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(results).toEqual(mockResponses);
  });

  it('should throw an error if any of the fetch calls fail', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error'),
    );

    const requests: FetchUrlOptions[] = [
      { url: 'http://example.com/1', options: {} },
    ];

    await expect(fetchCollectionData(requests)).rejects.toThrow(
      'Network error',
    );
  });
});

describe('fetchService.get', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call fetchData with correct GET method when apiBaseUrl is defined', async () => {
    const mockResponse = { data: 'test' };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const result = await fetchService.get('endpoint', {}, 'http://example.com');

    expect(global.fetch).toHaveBeenCalledWith(
      'http://example.comendpoint',
      expect.objectContaining({ method: 'GET' }),
    );
    expect(result).toEqual(mockResponse);
  });

  it('should call fetchData with correct GET method when apiBaseUrl is undefined', async () => {
    const mockResponse = { data: 'test' };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const result = await fetchService.get('endpoint');

    expect(global.fetch).toHaveBeenCalledWith(
      'endpoint',
      expect.objectContaining({ method: 'GET' }),
    );
    expect(result).toEqual(mockResponse);
  });
});

describe('fetchService.post', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call fetchData with correct POST method when apiBaseUrl is defined', async () => {
    const mockResponse = { data: 'test' };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const result = await fetchService.post(
      'endpoint',
      {},
      'http://example.com',
    );

    expect(global.fetch).toHaveBeenCalledWith(
      'http://example.comendpoint',
      expect.objectContaining({ method: 'POST' }),
    );
    expect(result).toEqual(mockResponse);
  });

  it('should call fetchData with correct POST method when apiBaseUrl is undefined', async () => {
    const mockResponse = { data: 'test' };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const result = await fetchService.post('endpoint');

    expect(global.fetch).toHaveBeenCalledWith(
      'endpoint',
      expect.objectContaining({ method: 'POST' }),
    );
    expect(result).toEqual(mockResponse);
  });
});

describe('fetchService.getCollection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should correctly fetch data from multiple GET endpoints when apiBaseUrl is defined', async () => {
    const mockResponses = [{ data: 'test1' }, { data: 'test2' }];
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponses[0]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponses[1]),
      });

    const requests: RequestType[] = [
      { endpoint: 'endpoint1', options: {}, apiBaseUrl: 'http://example.com' },
      { endpoint: 'endpoint2', options: {}, apiBaseUrl: 'http://example.com' },
    ];

    const results = await fetchService.getCollection(requests);

    expect(global.fetch).toHaveBeenCalledTimes(2);

    expect(results).toEqual(mockResponses);
  });

  it('should correctly fetch data from multiple GET endpoints when apiBaseUrl is undefined', async () => {
    const mockResponses = [{ data: 'test1' }, { data: 'test2' }];
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponses[0]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponses[1]),
      });

    const requests: RequestType[] = [
      { endpoint: 'endpoint1', options: {} },
      { endpoint: 'endpoint2', options: {} },
    ];

    const results = await fetchService.getCollection(requests);

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenCalledWith(
      'endpoint1',
      expect.objectContaining({ method: 'GET' }),
    );
    expect(global.fetch).toHaveBeenCalledWith(
      'endpoint2',
      expect.objectContaining({ method: 'GET' }),
    );
    expect(results).toEqual(mockResponses);
  });

  it('should throw an error if any GET request fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error'),
    );

    const requests: RequestType[] = [
      { endpoint: 'endpoint1', options: {}, apiBaseUrl: 'http://example.com' },
    ];

    await expect(fetchService.getCollection(requests)).rejects.toThrow(
      'Network error',
    );
  });
});

describe('fetchService.postCollection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should correctly fetch data from multiple POST endpoints when apiBaseUrl is defined', async () => {
    const mockResponses = [{ data: 'test1' }, { data: 'test2' }];
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponses[0]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponses[1]),
      });

    const requests: RequestType[] = [
      { endpoint: 'endpoint1', options: {}, apiBaseUrl: 'http://example.com' },
      { endpoint: 'endpoint2', options: {}, apiBaseUrl: 'http://example.com' },
    ];

    const results = await fetchService.postCollection(requests);

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenCalledWith(
      'http://example.com/endpoint1',
      expect.objectContaining({ method: 'POST' }),
    );
    expect(global.fetch).toHaveBeenCalledWith(
      'http://example.com/endpoint2',
      expect.objectContaining({ method: 'POST' }),
    );
    expect(results).toEqual(mockResponses);
  });

  it('should correctly fetch data from multiple POST endpoints when apiBaseUrl is undefined', async () => {
    const mockResponses = [{ data: 'test1' }, { data: 'test2' }];
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponses[0]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponses[1]),
      });

    const requests: RequestType[] = [
      { endpoint: 'endpoint1', options: {} },
      { endpoint: 'endpoint2', options: {} },
    ];

    const results = await fetchService.postCollection(requests);

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenCalledWith(
      'endpoint1',
      expect.objectContaining({ method: 'POST' }),
    );
    expect(global.fetch).toHaveBeenCalledWith(
      'endpoint2',
      expect.objectContaining({ method: 'POST' }),
    );
    expect(results).toEqual(mockResponses);
  });

  it('should throw an error if any POST request fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error'),
    );

    const requests: RequestType[] = [
      { endpoint: 'endpoint1', options: {}, apiBaseUrl: 'http://example.com' },
    ];

    await expect(fetchService.postCollection(requests)).rejects.toThrow(
      'Network error',
    );
  });
});
