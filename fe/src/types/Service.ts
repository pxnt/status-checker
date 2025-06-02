import type { ServiceStatus } from './Status'

export interface Service {
  id: string
  title: string
  status: ServiceStatus
}

export interface ServiceGroup {
  id: string
  title: string
  services: Service[]
  expanded?: boolean
}
