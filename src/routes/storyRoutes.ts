import { Router } from 'express';
import { getAllStories, getStoryById, createStory, deleteStory } from '../controllers/storyController';

const router = Router();

router.get('/', getAllStories);
router.get('/:id', getStoryById);
router.post('/', createStory);
router.delete('/:id', deleteStory);

export default router;
