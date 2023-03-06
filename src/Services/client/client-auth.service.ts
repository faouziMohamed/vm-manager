import {
  RESEND_EMAIL_VERIFICATION_LINK_ROUTE,
  RESET_PASSWORD_ROUTE,
  UPDATE_USER_EMAIL_ROUTE,
  VERIFY_EMAIL_ROUTE,
} from '@/lib/api-route';
import { AppException } from '@/lib/Exceptions/app.exceptions';
import { ErrorResponse, SuccessResponse } from '@/lib/types';

import { catchHttpErrors } from '@/Services/client/fetchers';

export async function tryVerifyUser(token: string) {
  const response = await fetch(VERIFY_EMAIL_ROUTE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });
  if (!response.ok) {
    const error = (await response.json()) as ErrorResponse;
    throw new AppException(error.message);
  }
  return response.json();
}

export async function resendEmailVerification() {
  const response = await fetch(RESEND_EMAIL_VERIFICATION_LINK_ROUTE, {
    method: 'POST',
  });
  await catchHttpErrors(response);
  return (await response.json()) as SuccessResponse;
}

export async function updateUserEmail(email: string) {
  const response = await fetch(UPDATE_USER_EMAIL_ROUTE, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  await catchHttpErrors(response);
  return (await response.json()) as SuccessResponse;
}

export async function resetPassword(password: string, token: string) {
  const response = await fetch(RESET_PASSWORD_ROUTE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password, token }),
  });
  await catchHttpErrors(response);
  return (await response.json()) as SuccessResponse;
}

export async function requestPasswordReset(email: string) {
  const emailQuery = new URLSearchParams({ email });
  const response = await fetch(
    `${RESET_PASSWORD_ROUTE}?${emailQuery.toString()}`,
  );
  await catchHttpErrors(response);
  return (await response.json()) as SuccessResponse;
}
