import { $axios } from './AxiosService';
import type { CreateComponentGroupPayload, CreateComponentPayload, UpdateComponentGroupPayload, UpdateComponentPayload } from '~/types/Component';
import type { CreateIncidentPayload, UpdateIncidentPayload } from '~/types/Incident';
import { useToast } from '~/composables/useToast';
import { handleResponseError } from '~/utils/APIErrors';

export default class StatusService {

  static async getComponentGroups(args: { userId: string, orgId: string }) {
    try {
      const { userId, orgId } = args

      const response = await $axios().get(`/component-groups`)

      return response?.data?.data;
    }
    catch (err: any) {
      console.log('Errored at getComponentGroups', err)
      handleResponseError(err);
      return null
    }
  }

  static async updateComponent(
    componentId: number,
    payload: UpdateComponentPayload) {
    try {
      // Filter out undefined values
      const cleanUpdatePayload = Object.fromEntries(
        Object.entries(payload).filter(([_, value]) => value !== undefined)
      );

      const response = await $axios().put(`/components/${componentId}`, cleanUpdatePayload);

      return response?.data?.data;
    }
    catch (err: any) {
      console.log('Errored at updateComponent', err);

      handleResponseError(err);
      return null;
    }
  }

  static async updateComponentGroup(
    component_group_id: number,
    payload: UpdateComponentGroupPayload) {
    try {
      const response = await $axios().put(`/component-groups/${component_group_id}`, payload);

      return response?.data?.data;
    }
    catch (err: any) {
      console.log('Errored at updateComponentGroup', err);

      handleResponseError(err);
      return null;
    }
  }

  static async createComponentGroup(payload: CreateComponentGroupPayload) {
    try {
      const response = await $axios().post('/component-groups/create', payload);

      return response?.data?.data;
    }
    catch (err) {
      console.log('Errored at createComponentGroup', err);
      handleResponseError(err);
      return null;
    }
  }

  static async createComponent(payload: CreateComponentPayload) {
    try {
      const response = await $axios().post('/components/create', payload);

      return response?.data?.data;
    }
    catch (err) {
      console.log('Errored at createComponent', err);
      handleResponseError(err);
      return null;
    }
  }

  static async getPublicComponentGroups() {
    try {
      const response = await $axios().get('/public/component-groups');

      return response?.data?.data;
    }
    catch (err) {
      console.log('Errored at getPublicComponentGroups', err);
      handleResponseError(err);
      return null;
    }
  }

  // Incident methods
  static async getIncidents() {
    try {
      const response = await $axios().get('/incidents');
      return response?.data?.data;
    }
    catch (err: any) {
      console.log('Errored at getIncidents', err);
      handleResponseError(err);
      return null;
    }
  }

  static async createIncident(payload: CreateIncidentPayload) {
    try {
      const response = await $axios().post('/incidents/create', payload);
      return response?.data?.data;
    }
    catch (err) {
      console.log('Errored at createIncident', err);
      handleResponseError(err);
      return null;
    }
  }

  static async updateIncident(incidentId: number, payload: UpdateIncidentPayload) {
    try {
      const cleanUpdatePayload = Object.fromEntries(
        Object.entries(payload).filter(([_, value]) => value !== undefined)
      );

      const response = await $axios().put(`/incidents/${incidentId}`, cleanUpdatePayload);
      return response?.data?.data;
    }
    catch (err: any) {
      console.log('Errored at updateIncident', err);
      handleResponseError(err);
      return null;
    }
  }

  static async deleteIncident(incidentId: number) {
    try {
      const response = await $axios().delete(`/incidents/${incidentId}`);
      return response?.data?.data;
    }
    catch (err: any) {
      console.log('Errored at deleteIncident', err);
      handleResponseError(err);
      return null;
    }
  }

  static async getPublicIncidents(args?: { start_date?: string, end_date?: string }) {
    try {
      const query: Record<string, string> = {}

      if (args?.start_date) {
        query.start_date = args.start_date;
      }
      if (args?.end_date) {
        query.end_date = args.end_date;
      }
      
      const response = await $axios().get('/public/incidents', {
        params: query,
      });
      return response?.data?.data;
    } catch (err: any) {
      console.log('Errored at getPublicIncidents', err);
      handleResponseError(err);
      return null;
    }
  }
}