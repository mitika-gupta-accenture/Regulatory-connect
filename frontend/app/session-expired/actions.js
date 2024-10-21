'use server';
import { cookies } from 'next/headers';

export async function renewSession() {
  const cookieSet = cookies();
  const originalSession = cookieSet.get('session_cookie');
  cookieSet.set('session_cookie', originalSession?.value, {
    // 10 minutes as default
    maxAge: 60 * Number(process.env.SESSION_TTL ?? 10),
  });
}
