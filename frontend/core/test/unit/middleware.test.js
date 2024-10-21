/** * @jest-environment node */

import { NextRequest } from 'next/server';
import { middleware } from '../../../middleware';

jest.mock('uuid', () => ({ v4: () => '0000-1111-2222-3333' }));

jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));

describe('middleware', () => {
  let mockGetCookies;
  let req;
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    process.env.SESSION_TTL = 30;

    mockGetCookies = jest.fn();
    mockGetCookies.mockReturnValueOnce('test');
    req = NextRequest;

    req.cookies = { get: mockGetCookies };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('sets a cookie_check cookie with secure options', async () => {
    const result = await middleware(req);
    expect(result.cookies.get('cookie_check')).toMatchObject({
      httpOnly: true,
      name: 'cookie_check',
      path: '/',
      sameSite: 'lax',
      secure: false,
      value: '1',
    });
  });

  it('sets a session_cookie with UUID, secure options and expires after 30 mins', async () => {
    const result = await middleware(req);
    expect(result.cookies.get('session_cookie')).toMatchObject({
      httpOnly: true,
      name: 'session_cookie',
      path: '/',
      sameSite: 'strict',
      secure: false,
      value: '0000-1111-2222-3333',
      maxAge: 1800,
      expires: new Date('2020-01-01T00:30:00.000Z'),
    });
  });

  it('sets a secure session_cookie when https used', async () => {
    process.env.PROTOCOL = 'https';
    const result = await middleware(req);
    expect(result.cookies.get('session_cookie')).toMatchObject({
      httpOnly: true,
      name: 'session_cookie',
      path: '/',
      sameSite: 'strict',
      secure: true,
      value: '0000-1111-2222-3333',
      maxAge: 1800,
      expires: new Date('2020-01-01T00:30:00.000Z'),
    });
  });

  it('sets a secure session validity token', async () => {
    process.env.PROTOCOL = 'https';
    const result = await middleware(req);
    expect(result.cookies.get('session_valid')).toMatchObject({
      httpOnly: true,
      name: 'session_valid',
      path: '/',
      sameSite: 'strict',
      secure: true,
      value: 'true',
    });
  });
});
