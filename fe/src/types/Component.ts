import type { ServiceStatus } from './Status'

export interface Component {
  id: number
  name: string
  description?: string
  status: ServiceStatus
  component_group_id: number
  visible: boolean
  createdAt?: Date
}

export interface ComponentGroup {
  id: number
  name: string
  user_id?: string
  org_id?: string
  visible: boolean
  createdAt?: Date
}

export interface PopulatedComponentGroup extends ComponentGroup {
  components?: Component[]
}

export type UpdateComponentPayload = Partial<Omit<Component, 'id' | 'createdAt'>>

export type UpdateComponentGroupPayload = Partial<Omit<ComponentGroup, 'id' | 'createdAt' | 'user_id' | 'org_id'>>

export type CreateComponentGroupPayload = Omit<ComponentGroup, 'id' | 'createdAt' | 'user_id' | 'org_id'>

export type CreateComponentPayload = Omit<Component, 'id' | 'createdAt'>