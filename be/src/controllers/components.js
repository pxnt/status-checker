import joi from "joi";
import * as CRepo from "../repositories/component.js";
import { control, validateJoi } from "../helpers/controller.js";
import { COMPONENT_STATUS } from "../config/constants.js";
import { emitPublicComponentGroupsUpdate } from "../helpers/socketEvents.js";

export const createComponent = control({
  validate: (req) => {
    const bodySchema = joi.object({
      name: joi.string().required(),
      status: joi.string().default(COMPONENT_STATUS.Operational),
      description: joi.string().optional(),
      component_group_id: joi.number().required(),
      visible: joi.boolean().default(true),
    });

    return validateJoi(bodySchema, req.body);
  },
  exec: async (req, res) => {
    const { userId, orgId } = req.auth;
    const { name, description, status, component_group_id, visible } = req.body;

    const component = await CRepo.createComponent({ name, description, status, component_group_id, visible });
    
    // Emit socket events for updates
    if (visible) {
      await emitPublicComponentGroupsUpdate({ component: component?.[0] });
    }
    
    return {
      data: component,
    };
  },
});

export const updateComponent = control({
  validate: (req) => {
    const paramsSchema = joi.object({
      component_id: joi.number().required(),
    });

    const bodySchema = joi.object({
      name: joi.string().optional(),
      status: joi.string().optional(),
      description: joi.string().optional(),
      component_group_id: joi.number().optional(),
      visible: joi.boolean().optional(),
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
    const { component_id } = req.params;
    const { name, description, status, component_group_id, visible } = req.body;
    
    const updateData = { name, description, status, component_group_id, visible };
    const component = await CRepo.updateComponent(component_id, updateData);
    
    // Emit socket events for updates if visibility changed or component is visible
    if (component?.[0]?.visible) {
      await emitPublicComponentGroupsUpdate({ component: component?.[0] });
    }
    
    return {
      data: component,
    };
  },
});