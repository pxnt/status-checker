import express from "express";
import { createIncident, getIncidents, updateIncident, deleteIncident, getPublicIncidents } from "../controllers/incidents.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { isLoggedin } from "../middlewares/isLoggedin.js";

const router = express.Router();

router.get('/incidents', [isLoggedin, isAdmin], getIncidents);
router.post('/incidents/create', [isLoggedin, isAdmin], createIncident);
router.put('/incidents/:incident_id', [isLoggedin, isAdmin], updateIncident);
router.delete('/incidents/:incident_id', [isLoggedin, isAdmin], deleteIncident);

router.get('/public/incidents', getPublicIncidents);

export default router; 