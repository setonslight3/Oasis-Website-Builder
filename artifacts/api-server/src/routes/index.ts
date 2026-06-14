import { Router, type IRouter } from "express";
import healthRouter from "./health";
import experiencesRouter from "./experiences";
import flaggedRouter from "./flagged";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/experiences", experiencesRouter);
router.use("/flagged", flaggedRouter);

export default router;
