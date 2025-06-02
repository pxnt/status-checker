import { Component, ComponentGroup, PopulatedComponentGroup } from '~/types/Component'
import type { Incident } from '~/types/Incident'
import socketService from '~/services/SocketService'

export function useLiveStatus() {
  
  // Socket event handlers for components
  async function handlePublicComponentGroupsUpdate(data: { componentGroup: ComponentGroup, component: Component }) {
    console.log('Received public component groups update via socket')
    const { componentGroup, component } = data

    const $componentsStore = await import('~/stores/components').then(m => m.useComponentsStore())

    if(componentGroup) {
      const cgIdx = $componentsStore.publicComponentGroups.findIndex(cg => cg.id === componentGroup.id)
      if (cgIdx !== -1) {
        $componentsStore.publicComponentGroups[cgIdx] = componentGroup
      }
      // $componentsStore.publicComponentGroups = $componentsStore.publicComponentGroups.sort((a, b) => a.id - b.id)
    }

    if (component) {
      const cIdx = $componentsStore.publicComponents.findIndex(c => c.id === component.id)
      if (cIdx !== -1) {
        $componentsStore.publicComponents[cIdx] = component
      }
      // $componentsStore.publicComponents = $componentsStore.publicComponents.sort((a, b) => a.id - b.id)
    }
  }

  // Socket event handlers for incidents
  async function handlePublicIncidentsUpdate(data: { incident: Incident, action: 'created' | 'updated' | 'deleted' }) {
    console.log('Received public incidents update via socket')
    const { incident, action } = data

    const $publicIncidentsStore = await import('~/stores/incidents').then(m => m.usePublicIncidentsStore())

    switch (action) {
      case 'created':
        // Add new incident and sort by occurred_at
        $publicIncidentsStore.publicIncidents.unshift(incident)
        $publicIncidentsStore.publicIncidents.sort((a, b) => 
          new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime()
        )
        break
      
      case 'updated':
        // Update existing incident
        const updateIdx = $publicIncidentsStore.publicIncidents.findIndex(i => i.id === incident.id)
        if (updateIdx !== -1) {
          $publicIncidentsStore.publicIncidents[updateIdx] = incident
          // Re-sort after update in case occurred_at changed
          $publicIncidentsStore.publicIncidents.sort((a, b) => 
            new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime()
          )
        }
        break
      
      case 'deleted':
        // Remove incident
        const deleteIdx = $publicIncidentsStore.publicIncidents.findIndex(i => i.id === incident.id)
        if (deleteIdx !== -1) {
          $publicIncidentsStore.publicIncidents.splice(deleteIdx, 1)
        }
        break
    }
  }

  // Initialize socket listeners
  function initializeSocketListeners() {
    socketService.connect();
    socketService.on('public-component-groups-updated', handlePublicComponentGroupsUpdate)
    socketService.on('public-incidents-updated', handlePublicIncidentsUpdate)
  }

  // Cleanup socket listeners
  function cleanupSocketListeners() {
    socketService.off('public-component-groups-updated', handlePublicComponentGroupsUpdate)
    socketService.off('public-incidents-updated', handlePublicIncidentsUpdate)
  }

  return {
    initializeSocketListeners,
    cleanupSocketListeners,
  }
}