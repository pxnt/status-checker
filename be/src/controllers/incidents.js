import joi from "joi";
import * as IRepo from "../repositories/incident.js";
import { control, validateJoi } from "../helpers/controller.js";
import * as CRepo from "../repositories/component.js";
import { emitPublicIncidentsUpdate } from "../helpers/socketEvents.js";

const INCIDENT_STATUSES = ['reported', 'investigating', 'identified', 'watching', 'fixed'];

export const createIncident = control({
  validate: (req) => {
    const bodySchema = joi.object({
      name: joi.string().required(),
      status: joi.string().valid(...INCIDENT_STATUSES).default('reported'),
      description: joi.string().required(),
      occurred_at: joi.date().default(() => new Date()),
      visible: joi.boolean().default(true),
      affected_components: joi.array().items(joi.number()).default([]),
    });

    return validateJoi(bodySchema, req.body);
  },
  exec: async (req) => {
    const { userId, orgId } = req.auth;
    const { name, status, description, occurred_at, visible, affected_components } = req.body;

    const incident = await IRepo.createIncident({ 
      name, 
      status, 
      description, 
      occurred_at, 
      visible, 
      affected_components,
      org_id: orgId,
      user_id: userId,
    });
    
    // Emit socket events for public incidents if visible
    if (visible && incident?.[0]) {
      // Get affected components for the socket event
      const affectedComponents = affected_components && affected_components.length > 0 
        ? await CRepo.getComponentsByIds(affected_components)
        : [];
      const incidentWithComponents = {
        ...incident[0],
        components: affectedComponents
      };
      
      await emitPublicIncidentsUpdate({ 
        incident: incidentWithComponents, 
        action: 'created' 
      });
    }
    
    return {
      data: incident,
    };
  },
});

export const getIncidents = control({
  validate: (req) => {
    return {};
  },
  exec: async (req, res) => {
    const { userId, orgId } = req.auth;
    
    let incidents = [];

    if (!orgId) {
      incidents = await IRepo.getIncidentsForUser(userId);
    } else {
      incidents = await IRepo.getIncidentsForOrg(orgId);
    }

    const affectedComponentIds = incidents.flatMap(incident => incident.affected_components);
    const affectedComponents = await CRepo.getComponentsByIds(affectedComponentIds);

    incidents.forEach(incident => {
      incident.components = affectedComponents
        .filter(component => incident.affected_components.includes(component.id));
    });
    
    return {
      data: incidents,
    };
  },
});

export const getPublicIncidents = control({
  validate: (req) => {
    const querySchema = joi.object({
      start_date: joi.date().optional(),
      end_date: joi.date().optional()
    });

    return validateJoi(querySchema, req.query);
  },
  exec: async (req) => {
    const { start_date, end_date } = req.query;
    
    const incidents = await IRepo.getPublicIncidents({ start_date, end_date });

    const affectedComponentIds = incidents.flatMap(incident => incident.affected_components);
    const affectedComponents = await CRepo.getComponentsByIds(affectedComponentIds);

    incidents.forEach(incident => {
      incident.components = affectedComponents
        .filter(component => incident.affected_components.includes(component.id));
    });
    
    return {
      data: incidents,
    };
  },
});

export const updateIncident = control({
  validate: (req) => {
    const paramsSchema = joi.object({
      incident_id: joi.number().required(),
    });

    const bodySchema = joi.object({
      name: joi.string().optional(),
      status: joi.string().valid(...INCIDENT_STATUSES).optional(),
      description: joi.string().optional(),
      occurred_at: joi.date().optional(),
      visible: joi.boolean().optional(),
      affected_components: joi.array().items(joi.number()).optional(),
    });

    const paramsValidation = validateJoi(paramsSchema, req.params);
    const bodyValidation = validateJoi(bodySchema, req.body);
    
    return {
      ...paramsValidation,
      ...bodyValidation,
    };
  },
  exec: async (req, res) => {
    const { userId, orgId } = req.auth;
    const { incident_id } = req.params;
    const { name, status, description, occurred_at, visible, affected_components } = req.body;
    
    const updateData = { name, status, description, occurred_at, visible, affected_components };
    const incident = await IRepo.updateIncident(incident_id, updateData);
    
    // Emit socket events for public incidents if visible
    if (incident?.[0] && (visible === true || (visible === undefined && incident[0].visible))) {
      // Get affected components for the socket event
      const componentIds = affected_components || incident[0].affected_components || [];
      const affectedComponents = componentIds.length > 0 
        ? await CRepo.getComponentsByIds(componentIds)
        : [];
      const incidentWithComponents = {
        ...incident[0],
        components: affectedComponents
      };
      
      await emitPublicIncidentsUpdate({ 
        incident: incidentWithComponents, 
        action: 'updated' 
      });
    }
    
    return {
      data: incident,
    };
  },
});

export const deleteIncident = control({
  validate: (req) => {
    const paramsSchema = joi.object({
      incident_id: joi.number().required(),
    });

    return validateJoi(paramsSchema, req.params);
  },
  exec: async (req, res) => {
    const { userId, orgId } = req.auth;
    const { incident_id } = req.params;
    
    // Get the incident before deleting to check visibility and get data for socket event
    const existingIncident = await IRepo.getIncidentById(incident_id);
    
    const incident = await IRepo.deleteIncident(incident_id);
    
    // Emit socket events for public incidents if the deleted incident was visible
    if (existingIncident?.visible && incident?.[0]) {
      // Get affected components for the socket event
      const componentIds = existingIncident.affected_components || [];
      const affectedComponents = componentIds.length > 0 
        ? await CRepo.getComponentsByIds(componentIds)
        : [];
      const incidentWithComponents = {
        ...incident[0],
        components: affectedComponents
      };
      
      await emitPublicIncidentsUpdate({ 
        incident: incidentWithComponents, 
        action: 'deleted' 
      });
    }
    
    return {
      data: incident,
    };
  },
}); 