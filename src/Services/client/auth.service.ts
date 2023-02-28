import { AppException } from '@/lib/Exceptions/app.exceptions';
import { ErrorResponse } from '@/lib/types';

export async function tryVerifyUser(token: string) {
  const response = await fetch('/api/v1/auth/verify-email', {
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
