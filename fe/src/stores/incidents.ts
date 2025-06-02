import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Incident, CreateIncidentPayload, UpdateIncidentPayload } from '~/types/Incident'
import StatusService from '~/services/StatusService'
import { useLiveStatus } from '~/composables/useLiveStatus'

export const useIncidentsStore = defineStore('incidents', () => {
  // State
  const incidents = ref<Incident[]>([])
  const isLoading = ref(false)
  const isCreating = ref(false)
  const isUpdating = ref(false)
  const isDeleting = ref(false)

  // Local Actions
  const addIncidentLocal = (incident: Incident) => {
    incidents.value.push(incident)
  }

  const updateIncidentLocal = (id: number, updates: UpdateIncidentPayload) => {
    const incidentIndex = incidents.value.findIndex(i => i.id === id)
    if (incidentIndex !== -1) {
      incidents.value[incidentIndex] = {
        ...incidents.value[incidentIndex],
        ...updates,
      }
    }
  }

  const deleteIncidentLocal = (id: number) => {
    const index = incidents.value.findIndex(i => i.id === id)
    if (index !== -1) {
      incidents.value.splice(index, 1)
    }
  }

  // API Actions
  async function getIncidents() {
    if (isLoading.value) return
    
    isLoading.value = true
    try {
      const response = await StatusService.getIncidents()
      if (response) {
        incidents.value = response.sort((a: Incident, b: Incident) => 
          new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime()
        )
      }
    } catch (err) {
      console.error('Error fetching incidents:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function createIncident(payload: CreateIncidentPayload) {
    if (isCreating.value) return
    
    isCreating.value = true
    try {
      const response = await StatusService.createIncident(payload)
      if (response && response.length > 0) {
        const createdIncident = response[0]
        addIncidentLocal(createdIncident)
      }
    } catch (err) {
      console.error('Error creating incident:', err)
      throw err
    } finally {
      isCreating.value = false
    }
  }

  async function updateIncident(incidentId: number, payload: UpdateIncidentPayload) {
    if (isUpdating.value) return
    
    isUpdating.value = true
    try {
      const response = await StatusService.updateIncident(incidentId, payload)
      if (response && response.length > 0) {
        const updatedIncident = response[0]
        updateIncidentLocal(incidentId, updatedIncident)
      }
    } catch (err) {
      console.error('Error updating incident:', err)
      throw err
    } finally {
      isUpdating.value = false
    }
  }

  async function deleteIncident(incidentId: number) {
    if (isDeleting.value) return
    
    isDeleting.value = true
    try {
      await StatusService.deleteIncident(incidentId)
      deleteIncidentLocal(incidentId)
    } catch (err) {
      console.error('Error deleting incident:', err)
      throw err
    } finally {
      isDeleting.value = false
    }
  }

  return {
    // State
    incidents,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    
    // Actions
    getIncidents,
    createIncident,
    updateIncident,
    deleteIncident,
    addIncidentLocal,
    updateIncidentLocal,
    deleteIncidentLocal,
  }
})

export const usePublicIncidentsStore = defineStore('publicIncidents', () => {
  // State
  const publicIncidents = ref<Incident[]>([])
  const isLoadingPublic = ref(false)

  // Computed - Group incidents by date
  const incidentsByDate = computed(() => {
    const groups: { [key: string]: Incident[] } = {}
    
    publicIncidents.value.forEach(incident => {
      const date = new Date(incident.occurred_at).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric'
      })
      
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(incident)
    })

    // Sort groups by date (newest first)
    const sortedGroups = Object.entries(groups).sort(([dateA], [dateB]) => {
      const [dayA, monthA, yearA] = dateA.split('/').map(Number)
      const [dayB, monthB, yearB] = dateB.split('/').map(Number)
      const dateObjA = new Date(yearA, monthA - 1, dayA)
      const dateObjB = new Date(yearB, monthB - 1, dayB)
      return dateObjB.getTime() - dateObjA.getTime()
    })

    return sortedGroups.reduce((acc, [date, incidents]) => {
      acc[date] = incidents.sort((a, b) => 
        new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime()
      )
      return acc
    }, {} as { [key: string]: Incident[] })
  })

  // API Actions
  async function getPublicIncidents(dateRange?: { start_date?: string, end_date?: string }) {
    if (isLoadingPublic.value) return
    
    isLoadingPublic.value = true
    try {
      const response = await StatusService.getPublicIncidents(dateRange)
      if (response) {
        publicIncidents.value = response.sort((a: Incident, b: Incident) => 
          new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime()
        )
      }
    } catch (err) {
      console.error('Error fetching public incidents:', err)
      throw err
    } finally {
      isLoadingPublic.value = false
    }
  }

  return {
    // State
    publicIncidents,
    isLoadingPublic,
    incidentsByDate,
    
    // Actions
    getPublicIncidents,
  }
}) 