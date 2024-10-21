import Formatters from '../../../util/Formatters';

describe('trimURL formatter', () => {
  it('should return domain without "www." for URL without path', () => {
    const inputURL = 'https://example.com';
    const expectedDomain = 'example.com';
    expect(Formatters.trimURL(inputURL)).toBe(expectedDomain);
  });

  it('should return domain without "www." for URL without https', () => {
    const inputURL = 'http://www.example.com';
    const expectedDomain = 'example.com';
    expect(Formatters.trimURL(inputURL)).toBe(expectedDomain);
  });

  it('should return domain without "www." for URL with "www." prefix', () => {
    const inputURL = 'https://www.example.com';
    const expectedDomain = 'example.com';
    expect(Formatters.trimURL(inputURL)).toBe(expectedDomain);
  });

  it('should return domain without "www." and path', () => {
    const inputURL = 'https://www.example.com/path';
    const expectedDomain = 'example.com';
    expect(Formatters.trimURL(inputURL)).toBe(expectedDomain);
  });

  it('should return domain without "www." for subdomain URLs', () => {
    const inputURL = 'https://www.sub.example.com';
    const expectedDomain = 'sub.example.com';
    expect(Formatters.trimURL(inputURL)).toBe(expectedDomain);
  });

  it('should return domain without "www." and ignore paths in URL', () => {
    const inputURL = 'https://www.example.com/something/something-else';
    const expectedDomain = 'example.com';
    expect(Formatters.trimURL(inputURL)).toBe(expectedDomain);
  });

  it('should return domain for URL without https and with path', () => {
    const inputURL = 'http://www.example.com/something/something-else';
    const expectedDomain = 'example.com';
    expect(Formatters.trimURL(inputURL)).toBe(expectedDomain);
  });

  it('should return domain for subdomain URLs with path', () => {
    const inputURL = 'https://subdomain.example.com/path/to/resource';
    const expectedDomain = 'subdomain.example.com';
    expect(Formatters.trimURL(inputURL)).toBe(expectedDomain);
  });

  it('should return domain for URL without protocol (http/https)', () => {
    const inputURL = 'www.example.com';
    const expectedDomain = 'example.com';
    expect(Formatters.trimURL(inputURL)).toBe(expectedDomain);
  });

  it('should return the input string when an invalid URL is passed', () => {
    const invalidURL = 'not a valid url';
    expect(Formatters.trimURL(invalidURL)).toBe(invalidURL);
  });

  it('should return the input string for a non-URL string', () => {
    const inputString = 'just some random text';
    expect(Formatters.trimURL(inputString)).toBe(inputString);
  });

  it('should return the input string for an empty string', () => {
    const emptyString = '';
    expect(Formatters.trimURL(emptyString)).toBe(emptyString);
  });
});