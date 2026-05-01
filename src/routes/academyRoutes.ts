import { Router } from 'express';
import { 
  getModules, 
  createModule, 
  getLessonsByModule, 
  addLessonToModule, 
  deleteModule, 
  deleteLesson, 
  getModuleById, 
  getProgress, 
  toggleProgress 
} from '../controllers/academyController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/modules', getModules);
router.get('/modules/:id', getModuleById);
router.post('/modules', createModule);
router.get('/modules/:id/lessons', getLessonsByModule);
router.post('/modules/:id/lessons', addLessonToModule);
router.delete('/modules/:id', deleteModule);
router.delete('/lessons/:id', deleteLesson);

router.get('/progress', authMiddleware, getProgress);
router.post('/progress/toggle', authMiddleware, toggleProgress);

export default router;
