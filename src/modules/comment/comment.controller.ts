import { Request, Response } from "express";
import { commentServices } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
    try {

        req.body.authorId = req.user?.id
        const result = await commentServices.createComment(req.body);
        res.status(201).send(result);
    } catch (error) {
        res.send({
            message: error
        })
    }
}

const getCommentById = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;
        if (!commentId) {
            return res.status(400).json({
                message: "commentId is required",
            });
        }
        const result = await commentServices.getCommentById(commentId as string);
        res.status(200).json({
            data: result
        })
    } catch (error) {
        return res.status(404).json({
            message: error instanceof Error ? error.message : "Comment Not Found"
        })
    }
}

const getCommentByAuthorId = async(req: Request, res: Response) => {
    try {
        const {authorId} = req.params;
        if(!authorId){
            return res.status(400).json({
                message: "AuthorId Required!"
            })
        }
        const result = await commentServices.getCommentByAuthorId(authorId as string);
        res.status(200).json({
            data: result
        })
    } catch (error) {
        return res.status(404).json({
            message: error instanceof Error ? error.message : 'Comment Not Found'
        })
    }
}

const deleteComment = async (req: Request, res: Response) => {
    try {
        const authorId = req.user?.id
        const {commentId} = req.params;
        console.log(authorId, commentId)
        const result = await commentServices.deleteComment(commentId as string,authorId as string)
        res.status(200).json({
            data: result
        })
    } catch (error) {
        return res.status(404).json({
            message: error instanceof Error ? error.message : "Comment not found"
        })
    }
}

const updateComment = async(req: Request, res: Response) => {
    try {
        const authorId = req.user?.id;
        const {commentId} = req.params;
        const result = await commentServices.updateComment(authorId as string ,req.body,commentId as string)
        res.status(200).json(result)
    } catch (error) {
        return res.status(404).json({
            message: error instanceof Error ? error.message : "Comment Not Found"
        })
    }
}

const moderateComment = async(req: Request, res: Response) => {
    try {
      const {commentId} = req.params;
      const result = await commentServices.moderateComment(commentId as string, req.body);
      res.status(200).json({
        result
      })
    } catch (error) {
        return res.status(404).json({
            message: error instanceof Error ? error.message : "Comment Updated Failed"
        })
    }
}

export const commentController = {
    createComment,
    getCommentById,
    getCommentByAuthorId,
    deleteComment,
    updateComment,
    moderateComment
}