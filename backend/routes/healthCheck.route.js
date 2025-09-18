import { Router } from "express";

import { healthCheck } from "../controllers/healthCheck.controller.js";

const router = Router();

router.get("/healthcheck", healthCheck);
export default router;