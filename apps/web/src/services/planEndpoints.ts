export const PLAN_ENDPOINTS = {
  list: '/api/v1/plans',
  byId: (planId: string) => `/api/v1/plans/${planId}`,
  activate: (planId: string) => `/api/v1/plans/${planId}/activate`,
  deactivate: (planId: string) => `/api/v1/plans/${planId}/deactivate`,
} as const;
