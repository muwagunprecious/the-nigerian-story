import { Router } from 'express';
import { getStats, getApplications, updateApplicationStatus } from '../controllers/adminController';

const router = Router();

router.get('/stats', getStats);
router.get('/applications', getApplications);
router.patch('/applications', updateApplicationStatus);

export default router;
