import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Component, ComponentGroup, CreateComponentGroupPayload, CreateComponentPayload, PopulatedComponentGroup, UpdateComponentGroupPayload, UpdateComponentPayload } from '~/types/Component'
import StatusService from '~/services/StatusService'
import { useLiveStatus } from '~/composables/useLiveStatus'

export const useComponentsStore = defineStore('components', () => {
  // Component Groups
  const componentGroups = ref<ComponentGroup[]>([])
  const publicComponentGroups = ref<ComponentGroup[]>([])

  // Components
  const components = ref<Component[]>([])
  const publicComponents = ref<Component[]>([])

  // Computed
  const getComponentGroupById = computed(() => {
    return (component_group_id: number) => componentGroups.value.find(g => g.id === component_group_id)
  })
  const getComponentsForGroup = computed(() => {
    return (component_group_id: number) => components.value.filter(c => c.component_group_id === component_group_id)
  })

  const getPublicComponentsForGroup = computed(() => {
    return (component_group_id: number) => publicComponents.value.filter(c => c.component_group_id === component_group_id)
  })

  // Component Group Actions
  const addComponentGroupLocal = (group: ComponentGroup) => {
    componentGroups.value.push(group)
  }

  const updateComponentGroupLocal = (id: number, updates: UpdateComponentGroupPayload) => {
    const groupIndex = componentGroups.value.findIndex(g => g.id === id)
    if (groupIndex !== -1) {
      componentGroups.value[groupIndex] = {
        ...componentGroups.value[groupIndex],
        ...updates,
      }
    }
  }

  const deleteComponentGroup = (id: number) => {
    const index = componentGroups.value.findIndex(g => g.id === id)
    if (index !== -1) {
      componentGroups.value.splice(index, 1)
      // Also remove all components in this group
      components.value = components.value.filter(c => c.component_group_id !== id)
    }
  }

  // Component Actions (Local state updates)
  const addComponentLocal = (component: Omit<Component, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newComponent: Component = {
      ...component,
      id: Date.now(),
      createdAt: new Date(),
    }
    components.value.push(newComponent)
    return newComponent
  }

  const updateComponentLocal = (id: number, updates: UpdateComponentPayload) => {
    const componentIndex = components.value.findIndex(c => c.id === id)
    if (componentIndex !== -1) {
      components.value[componentIndex] = {
        ...components.value[componentIndex],
        ...updates,
      }
    }
  }

  const deleteComponent = (id: number) => {
    const index = components.value.findIndex(c => c.id === id)
    if (index !== -1) {
      components.value.splice(index, 1)
    }
  }

  // API Actions
  async function getComponentGroups() {
    const response = await StatusService.getComponentGroups({
      userId: 'user_1',
      orgId: 'org_1'
    })
    if (response) {
      const _componentGroups: ComponentGroup[] = [];
      const _components: Component[] = [];

      response.componentGroups.forEach((group: PopulatedComponentGroup) => {
        _components.push(
          ...(group.components || []),
        )
        delete group.components;

        _componentGroups.push(group)
      });

      componentGroups.value = _componentGroups.sort((a, b) => a.id - b.id);
      components.value = _components.sort((a, b) => a.id - b.id);
    }
  }

  async function updateComponent(
    componentId: number,
    payload: UpdateComponentPayload) {
    try {
      const response = await StatusService.updateComponent(componentId, payload);
      
      if (response && response.length > 0) {
        // Update local state with the response from the server
        const updatedComponent = response[0];
        updateComponentLocal(updatedComponent.id, updatedComponent);
      }
      
    } catch (err) {
      console.error('Error updating component:', err);
    }
  }

  async function updateComponentGroup(
    component_group_id: number,
    payload: UpdateComponentGroupPayload) {
    try {
      const response = await StatusService.updateComponentGroup(component_group_id, payload);
      if (response && response.length > 0) {
        const updatedComponentGroup = response[0];
        updateComponentGroupLocal(component_group_id, updatedComponentGroup);
      }
    } catch (err) {
      console.error('Error updating component group:', err);
    }
  }

  async function createComponentGroup(payload: CreateComponentGroupPayload) {
    try {
      const response = await StatusService.createComponentGroup({
        name: payload.name,
        visible: payload.visible,
      });
      if (response && response.length > 0) {
        const createdComponentGroup = response[0];
        addComponentGroupLocal(createdComponentGroup);
      }
    } catch (err) {
      console.error('Error creating component group:', err);
    }
  }

  async function createComponent(payload: CreateComponentPayload) {
    try {
      const response = await StatusService.createComponent(payload);

      if (response && response.length > 0) {
        const createdComponent = response[0];
        addComponentLocal(createdComponent);
      }
    } catch (err) {
      console.error('Error creating component:', err);
    }
  }

  async function listPublicComponentGroups() {

    const response = await StatusService.getPublicComponentGroups();
    if (response) {
      const _componentGroups: ComponentGroup[] = [];
      const _components: Component[] = [];

      response.componentGroups.forEach((group: PopulatedComponentGroup) => {
        _components.push(
          ...(group.components || []),
        )
        delete group.components;

        _componentGroups.push(group)
      });

      publicComponentGroups.value = _componentGroups.sort((a, b) => a.id - b.id);
      publicComponents.value = _components.sort((a, b) => a.id - b.id);
    }
  }

  return {
    // State
    componentGroups,
    components,
    publicComponentGroups,
    publicComponents,

    // Getters
    getComponentGroupById,
    getComponentsForGroup,
    getPublicComponentsForGroup,
    
    // Component Group Actions
    deleteComponentGroup,
    
    // Component Actions
    deleteComponent,

    // API Actions
    getComponentGroups,
    updateComponent,
    updateComponentGroup,
    createComponentGroup,
    createComponent,

    // Public Component Actions
    listPublicComponentGroups,
  }
}) 