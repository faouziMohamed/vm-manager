const API_BASE = '/api/v1';
export const REGIONS_ROUTE = `${API_BASE}/regions`;
export const ALL_INSTANCES_ROUTE = `${API_BASE}/instances`;
export const NEW_INSTANCE_ROUTE = `${API_BASE}/instances/new`;
export const getInstanceRoute = (vmId: string) =>
  `${API_BASE}/instances/${vmId}`;
export const getInstanceActionRoute = (vmId: string, action: string) =>
  `${API_BASE}/instances/${vmId}/${action}`;
export const VERIFY_EMAIL_ROUTE = `${API_BASE}/auth/verify-email`;
export const RESEND_EMAIL_VERIFICATION_LINK_ROUTE = `${API_BASE}/auth/resend-verification`;
export const UPDATE_USER_EMAIL_ROUTE = `${API_BASE}/auth/update-email`;
