import express from "express";
import { getComponentGroups, createComponentGroup, updateComponentGroup, getPublicComponentGroups } from "../controllers/component-groups.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { isLoggedin } from "../middlewares/isLoggedin.js";

const router = express.Router();

router.post('/component-groups/create', [isLoggedin, isAdmin], createComponentGroup);
router.get('/component-groups', [isLoggedin], getComponentGroups);
router.put('/component-groups/:component_group_id', [isLoggedin, isAdmin], updateComponentGroup);

router.get('/public/component-groups', getPublicComponentGroups);

export default router;