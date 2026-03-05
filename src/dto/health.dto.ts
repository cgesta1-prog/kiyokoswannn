export type HealthStatus = 'ok' | 'degraded';

export interface HealthResponseDto {
  status: HealthStatus;
  uptimeSeconds: number;
  now: string; // ISO timestamp
}
