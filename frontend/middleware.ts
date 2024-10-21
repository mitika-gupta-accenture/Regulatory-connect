'use server';

import { NextResponse, NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// eslint-disable-next-line @typescript-eslint/require-await
export async function middleware(req: NextRequest) {
  const cookieCheck = req.cookies.get('cookie_check')?.value;
  let sessionUUID = req.cookies.get('session_cookie')?.value || uuidv4();
  const cookieValidityCheck = req.cookies.get('session_valid')?.value;

  const nonce = Buffer.from(uuidv4()).toString('base64');
  const cspHeader = '';
  // const cspHeader = `
  //   default-src 'self';
  //   img-src 'self' http://images.ctfassets.net/ data:
  //   https://www.report-terrorist-material.homeoffice.gov.uk/public/images/ ;
  //   script-src 'self' 'nonce-${nonce}' 'strict-dynamic'
  //   https: http: 'unsafe-inline' ${process.env.NODE_ENV === 'production' ? '' : `'unsafe-eval'`};;
  //   font-src 'self' data: https://design-system.service.gov.uk fonts.gstatic.com;
  //   style-src 'self' 'nonce-${nonce}';
  //   frame-ancestors 'self';
  //   form-action 'self' 'nonce-${nonce}';
  //   connect-src 'self' *.in.applicationinsights.azure.com/;
  //       `;

  const contentSecurityPolicyHeader = cspHeader.replace(/\s{2,}/g, ' ').trim();

  const reqHeaders = new Headers(req.headers);
  reqHeaders.set('x-nonce', nonce);

  reqHeaders.set('Content-Security-Policy', contentSecurityPolicyHeader);

  const res = NextResponse.next({
    request: {
      headers: reqHeaders,
    },
  });

  res.headers.set('Content-Security-Policy', contentSecurityPolicyHeader);
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Access-Control-Allow-Origin', '*');

  if (!cookieCheck) {
    res.cookies.set({
      name: 'cookie_check',
      value: '1',
      sameSite: 'lax',
      httpOnly: true,
      secure: process.env.PROTOCOL === 'https',
    });
  }

  // session_valid cookie has no maxAge and will be removed on browser
  // close, allowing us to reset the session cookie value
  if (!cookieValidityCheck) {
    sessionUUID = uuidv4();
    res.cookies.set({
      name: 'session_valid',
      value: 'true',
      sameSite: 'strict',
      httpOnly: true,
      secure: process.env.PROTOCOL === 'https',
    });
  }

  // updates cookie maxAge per page GET/POST
  res.cookies.set({
    name: 'session_cookie',
    value: sessionUUID,
    sameSite: 'strict',
    httpOnly: true,
    secure: process.env.PROTOCOL === 'https',
    // 10 minutes as default
    maxAge: 60 * Number(process.env.SESSION_TTL ?? 10),
  });

  return res;
}

// export const config = {
//   matcher: [
//     {
//       source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
//       missing: [
//         { type: 'header', key: 'next-router-prefetch' },
//         { type: 'header', key: 'purpose', value: 'prefetch' },
//       ],
//     },
//   ],
// };
