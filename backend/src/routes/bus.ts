import express from 'express';
import buscontroller from '../controllers/searchbuscontroller';

const router = express.Router();

router.get('/stops', buscontroller.GetAllStops);
router.get('/search', buscontroller.SearchRoutes);

export default router;