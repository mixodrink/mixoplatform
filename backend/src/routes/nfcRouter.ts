import { createNfc, getNfc } from "controllers/nfc.controller";
import { Router } from "express";

const router = Router();

router.post("/createNfc", createNfc);
router.get("/getNfc", getNfc);

export default router;
