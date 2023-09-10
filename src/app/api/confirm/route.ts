import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

import { apiHandler } from '@/api/api-handler/api.handler';
import { ROUTES } from '@/routes/routes.handler';

import { AUTH_COOKIE_AGE, COOKIES } from '@/cookie/consts';

export async function GET(request: Request) {
  const clientUrl = process.env.NEXT_PUBLIC_CLIENT_URL;

  if (!clientUrl) {
    redirect(ROUTES.main());
  }

  const search = new URL(request.url).search;
  const urlParams = new URLSearchParams(search);

  const keyQuery = urlParams.get('key');
  const fromQuery = urlParams.get('from');
  const emailQuery = urlParams.get('email');

  if (!keyQuery || !emailQuery) {
    redirect(ROUTES.main());
  }

  const userConfirmResponse = await apiHandler.confirmUser({ email: emailQuery, otp: keyQuery });

  if (userConfirmResponse.status === 'ok') {
    const response = NextResponse.redirect(`${clientUrl}${fromQuery ? fromQuery : ROUTES.main()}`, {
      status: 302,
    });

    response.cookies.set(COOKIES.AUTH, userConfirmResponse.result.token.token, {
      maxAge: AUTH_COOKIE_AGE,
    });

    return response;
  }

  redirect(ROUTES.main());
}
