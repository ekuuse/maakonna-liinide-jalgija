import express from 'express';
import buscontroller from '../controllers/searchbuscontroller';

const router = express.Router();

router.get('/search/:stop', buscontroller.LookForTimes);

export default router;