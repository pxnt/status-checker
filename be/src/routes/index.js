import express from "express";
import componentGroupsRouter from "./component-groups.js";
import componentsRouter from "./components.js";
import incidentsRouter from "./incidents.js";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";

const router = express.Router();

router.use(ClerkExpressWithAuth());

router.use('/', componentGroupsRouter);
router.use('/', componentsRouter);
router.use('/', incidentsRouter);

export default router;