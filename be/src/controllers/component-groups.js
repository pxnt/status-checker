import { control, validateJoi } from "../helpers/controller.js";
import joi from "joi";
import * as CGRepo from "../repositories/component-groups.js";
import { emitPublicComponentGroupsUpdate } from "../helpers/socketEvents.js";

export const createComponentGroup = control({
  validate: (req) => {
    const bodySchema = joi.object({
      name: joi.string().required(),
      visible: joi.boolean().default(true),
    });

    return validateJoi(bodySchema, req.body);
  },
  exec: async (req, res) => {
    const { userId, orgId } = req.auth;
    const { name, visible } = req.body;

    const componentGroups = await CGRepo.createComponentGroup({ name, user_id: userId, org_id: orgId, visible });
    
    // Emit socket events for updates
    if (visible) {
      await emitPublicComponentGroupsUpdate({ componentGroup: componentGroups?.[0] });
    }
    
    return {
      data: componentGroups,
    };
  },
});

export const getComponentGroups = control({
  validate: (req) => {
    return {};
  },
  exec: async (req, res) => {
    const { userId, orgId } = req.auth;

    let componentGroups = [];
    if (!orgId) {
      componentGroups = await CGRepo.getComponentGroupsForUser(userId);
    } else {
      componentGroups = await CGRepo.getComponentGroupsForOrg(orgId);
    }

    return {
      data: {
        componentGroups,
      },
    };
  },
});

export const updateComponentGroup = control({
  validate: (req) => {
    const paramsSchema = joi.object({
      component_group_id: joi.number().required(),
    });

    const bodySchema = joi.object({
      name: joi.string().optional(),
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
    const { component_group_id } = req.params;
    const { name, visible } = req.body;

    let componentGroup = null;
    if (!orgId) {
      componentGroup = await CGRepo.updateComponentGroupForUser(userId, component_group_id, { name, visible });
    } else {
      componentGroup = await CGRepo.updateComponentGroupForOrg(orgId, component_group_id, { name, visible });
    }

    // Emit socket events for updates if visibility changed or component group is visible
    if (visible !== undefined || componentGroup?.[0]?.visible) {
      await emitPublicComponentGroupsUpdate({ componentGroup: componentGroup?.[0] });
    }

    return {
      data: componentGroup,
    };
  },
});

export const getPublicComponentGroups = control({
  validate: (req) => {
    return {};
  },
  exec: async (req, res) => {
    const componentGroups = await CGRepo.getPublicComponentGroups();

    return {
      data: {
        componentGroups,
      },
    };
  },
});