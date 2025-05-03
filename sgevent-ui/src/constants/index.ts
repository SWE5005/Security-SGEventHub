export const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'SUSPENDED', label: 'Suspended' },
];
export const DATETIME_FORMAT = 'DD/MM/YYYY HH:mm:ss';

export const HOME_MAPPING: Record<SgehRoles, string> = {
  END_USER: '/events',
  EVENT_MANAGER: '/events',
  SUPER_ADMIN: '/users',
};

export const TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

export const ROLE_OPTIONS: Array<{ value: SgehRoles; label: string }> = [
  { value: 'END_USER', label: 'End User' },
  { value: 'EVENT_MANAGER', label: 'Event Manager' },
  { value: 'SUPER_ADMIN', label: 'Super Admin' },
];
