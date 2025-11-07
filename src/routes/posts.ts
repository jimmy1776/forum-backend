import express from 'express';
import * as postsController from '../controllers/posts.js';
const router = express.Router();

router.get('/',postsController.getPosts);
router.post('/',postsController.createPosts);


router.get('/:id', postsController.getPost);
router.patch('/:id',postsController.updatePost);
router.delete('/:id',postsController.deletePost);

router.post('/:postId/likes/:userId', postsController.createLike); 
router.delete('/:id/likes', postsController.deleteLike);

router.post('/:id/follows', postsController.createFollow); 
router.delete('/:id/follows', postsController.deleteFollow);

router.get('/:id/replies', postsController.getReplies);
router.post('/:id/replies', postsController.createReply);

export default router;



