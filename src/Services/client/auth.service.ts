import {
  RESEND_EMAIL_VERIFICATION_LINK_ROUTE,
  UPDATE_USER_EMAIL_ROUTE,
  VERIFY_EMAIL_ROUTE,
} from '@/lib/api-route';
import {
  AppException,
  AppUserDoesNotExistException,
} from '@/lib/Exceptions/app.exceptions';
import { ErrorResponse, SuccessResponse } from '@/lib/types';

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

async function catchHttpErrors(response: Response) {
  if (response.status === 401) {
    const error = (await response.json()) as ErrorResponse;
    throw new AppUserDoesNotExistException(error.message);
  }
  if (!response.ok) {
    const error = (await response.json()) as ErrorResponse;
    throw new AppException(error.message);
  }
}
