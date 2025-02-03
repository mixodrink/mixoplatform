import { createMachine } from "../controllers/machine.controller";
import { Router } from "express";

const machineRouter = Router();

machineRouter.post("/createMachine", createMachine);

export default machineRouter;
