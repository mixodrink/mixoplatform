import { Router } from "express";
import { createService } from "../controllers/service.controller";

const router = Router();

router.post("/createService", createService);

export default router;
