export type ServiceStatus = 'operational' | 'performance' | 'partial' | 'major' | 'unknown'

export enum ServiceStatusName {
  Operational = 'Operational',
  Performance = 'Performance Issues',
  Partial = 'Partial Outage',
  Major = 'Major Outage',
  Unknown = 'Unknown'
}
