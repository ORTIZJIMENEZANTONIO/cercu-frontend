export const URGENCY_TIERS = {
  standard: { label: 'Estandar', color: 'info', description: 'En los proximos dias' },
  today: { label: 'Hoy', color: 'warning', description: 'Lo necesito hoy' },
  immediate: { label: 'Inmediato', color: 'danger', description: 'Es una emergencia' },
} as const;

export const LEAD_STATUSES = {
  pending: { label: 'Pendiente', color: 'warning' },
  matched: { label: 'Matcheado', color: 'info' },
  taken: { label: 'Tomado', color: 'primary' },
  in_progress: { label: 'En progreso', color: 'info' },
  completed: { label: 'Completado', color: 'success' },
  cancelled: { label: 'Cancelado', color: 'secondary' },
  expired: { label: 'Expirado', color: 'secondary' },
} as const;

export const USER_ROLES = {
  user: { label: 'Usuario', color: 'primary' },
  professional: { label: 'Profesional', color: 'success' },
  admin: { label: 'Administrador', color: 'danger' },
} as const;

export const CDMX_CENTER = { lat: 19.4326, lng: -99.1332 };

export const MAX_PHOTOS = 4;
export const MAX_LEADS_PER_DAY = 3;
export const OTP_LENGTH = 4;
export const OTP_COOLDOWN_SECONDS = 60;
export const LEAD_EXPIRY_HOURS = 48;
