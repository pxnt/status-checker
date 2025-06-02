import type { Component } from './Component'

export type IncidentStatus = 'reported' | 'investigating' | 'identified' | 'watching' | 'fixed'

export interface Incident {
  id: number
  name: string
  status: IncidentStatus
  description: string
  occurred_at: Date
  visible: boolean
  affected_components: number[] // Array of component IDs
  components?: Component[] // Populated component objects (when returned from API)
  createdAt?: Date
  updatedAt?: Date
}

export type UpdateIncidentPayload = Partial<Omit<Incident, 'id' | 'createdAt' | 'updatedAt'>>

export type CreateIncidentPayload = Omit<Incident, 'id' | 'createdAt' | 'updatedAt'> 