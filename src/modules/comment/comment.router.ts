import { Router } from "express";
import { commentController } from "./comment.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = Router();

router.get('/:commentId', commentController.getCommentById);
router.get('/author/:authorId', commentController.getCommentByAuthorId);
router.post('/create-comment', auth(UserRole.USER, UserRole.ADMIN), commentController.createComment);
router.delete('/:commentId',auth(UserRole.USER, UserRole.ADMIN), commentController.deleteComment);
router.patch('/:commentId',auth(UserRole.USER, UserRole.ADMIN), commentController.updateComment);
router.patch('/:commentId/moderate',auth(UserRole.ADMIN), commentController.moderateComment);

export const commentRouter = router;