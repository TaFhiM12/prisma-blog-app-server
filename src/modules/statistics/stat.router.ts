import { Router } from "express";
import { statsController } from "./stat.controller";

const router = Router();

router.get('/', statsController.getStat);

export const statsRouter = router;