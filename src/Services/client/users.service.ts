import { UPLOAD_USER_IMAGE_ROUTE } from '@/lib/api-route';
import { SuccessResponse } from '@/lib/types';

import { catchHttpErrors } from '@/Services/client/fetchers';

export async function uploadUserImage(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(UPLOAD_USER_IMAGE_ROUTE, {
    method: 'PUT',
    body: formData,
  });
  await catchHttpErrors(response);
  return (await response.json()) as SuccessResponse;
}
