import express, { NextFunction, Request, Response, Router } from 'express'
import { postController } from './post.controller';
import auth, { UserRole } from '../../middleware/auth';


const router = express.Router();


router.get('/all-post', postController.getAllPost);
router.get('/my-post', auth(UserRole.USER, UserRole.ADMIN), postController.getMyPosts);
router.get('/:id', postController.getPostById);
router.post('/create', auth(UserRole.USER, UserRole.ADMIN), postController.createPost);
router.patch('/:postId', auth(UserRole.USER, UserRole.ADMIN), postController.updatePost)
router.delete('/:postId', auth(UserRole.USER, UserRole.ADMIN), postController.updatePost)

export const postRouter: Router = router;