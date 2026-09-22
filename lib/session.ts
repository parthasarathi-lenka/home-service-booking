import { cookies } from 'next/headers';

// Minimal cookie-based session for demo purposes.
// For production, swap this for iron-session, NextAuth, or Lucia.
const COOKIE_NAME = 'hsb_session';

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
};

export function setSession(user: SessionUser) {
  const value = Buffer.from(JSON.stringify(user)).toString('base64');
  cookies().set(COOKIE_NAME, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function getSession(): SessionUser | null {
  const raw = cookies().get(COOKIE_NAME)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(Buffer.from(raw, 'base64').toString('utf-8')) as SessionUser;
  } catch {
    return null;
  }
}

export function clearSession() {
  cookies().set(COOKIE_NAME, '', { path: '/', maxAge: 0 });
}
