import express from "express";
import LoveController from "../controller/LoveController";
import {authMiddleware} from "../util/middleware/AuthMiddleware";

const router = express.Router();

router.post('/saveLoveMusic', authMiddleware, LoveController.saveLoveMusicApi);
router.get('/getMusicIdsByUserLove', authMiddleware, LoveController.getMusicIdsByUserLoveApi);
export default router;