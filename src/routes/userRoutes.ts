import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  getReferrals,
  getAmbassadorStatus,
  submitAmbassadorApplication,
  getLeaderboard,
  getNotifications,
  createNotification
} from '../controllers/userController';

const router = Router();

router.get('/profile/:id', getProfile);
router.patch('/profile/:id', updateProfile);
router.get('/referrals', getReferrals);
router.get('/ambassador', getAmbassadorStatus);
router.post('/ambassador', submitAmbassadorApplication);
router.get('/leaderboard', getLeaderboard);
router.get('/notifications', getNotifications);
router.post('/notifications', createNotification);

export default router;
