import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { routes } from '@workspace/routes';

export async function POST() {
  const cookieStore: any = await cookies();

  // Clear session-related cookies
  cookieStore.delete('next-auth.session-token');
  cookieStore.delete('next-auth.csrf-token');
  cookieStore.delete('__Secure-next-auth.session-token'); // Default cookie name for production
  cookieStore.delete('authjs.session-token'); // Default for secure environments
  cookieStore.delete('authjs.callback-url');

  // Redirect the user to the sign-in page
  return NextResponse.json({
    message: 'Sign out successful',
    status: 200,
    redirect: routes.dashboard.auth.SignIn
  });
}
