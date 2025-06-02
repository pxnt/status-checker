import express from "express";
import { createComponent, updateComponent } from "../controllers/components.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { isLoggedin } from "../middlewares/isLoggedin.js";

const router = express.Router();

router.post('/components/create', [isLoggedin, isAdmin], createComponent);
router.put('/components/:component_id', [isLoggedin, isAdmin], updateComponent);

export default router;