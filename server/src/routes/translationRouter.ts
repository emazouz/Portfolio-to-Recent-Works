import { Router } from "express";
import {
  detectLanguage,
  translateBatch,
  translateText,
} from "../controllers/translationController";

const router = Router();

router.post("/translate", translateText);
router.post("/translate/batch", translateBatch);
router.post("/translate/detect", detectLanguage);

export default router;
