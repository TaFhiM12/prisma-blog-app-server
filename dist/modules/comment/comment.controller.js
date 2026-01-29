import { commentServices } from "./comment.service";
const createComment = async (req, res) => {
    try {
        req.body.authorId = req.user?.id;
        const result = await commentServices.createComment(req.body);
        res.status(201).send(result);
    }
    catch (error) {
        res.send({
            message: error
        });
    }
};
const getCommentById = async (req, res) => {
    try {
        const { commentId } = req.params;
        if (!commentId) {
            return res.status(400).json({
                message: "commentId is required",
            });
        }
        const result = await commentServices.getCommentById(commentId);
        res.status(200).json({
            data: result
        });
    }
    catch (error) {
        return res.status(404).json({
            message: error instanceof Error ? error.message : "Comment Not Found"
        });
    }
};
const getCommentByAuthorId = async (req, res) => {
    try {
        const { authorId } = req.params;
        if (!authorId) {
            return res.status(400).json({
                message: "AuthorId Required!"
            });
        }
        const result = await commentServices.getCommentByAuthorId(authorId);
        res.status(200).json({
            data: result
        });
    }
    catch (error) {
        return res.status(404).json({
            message: error instanceof Error ? error.message : 'Comment Not Found'
        });
    }
};
const deleteComment = async (req, res) => {
    try {
        const authorId = req.user?.id;
        const { commentId } = req.params;
        console.log(authorId, commentId);
        const result = await commentServices.deleteComment(commentId, authorId);
        res.status(200).json({
            data: result
        });
    }
    catch (error) {
        return res.status(404).json({
            message: error instanceof Error ? error.message : "Comment not found"
        });
    }
};
const updateComment = async (req, res) => {
    try {
        const authorId = req.user?.id;
        const { commentId } = req.params;
        const result = await commentServices.updateComment(authorId, req.body, commentId);
        res.status(200).json(result);
    }
    catch (error) {
        return res.status(404).json({
            message: error instanceof Error ? error.message : "Comment Not Found"
        });
    }
};
const moderateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const result = await commentServices.moderateComment(commentId, req.body);
        res.status(200).json({
            result
        });
    }
    catch (error) {
        return res.status(404).json({
            message: error instanceof Error ? error.message : "Comment Updated Failed"
        });
    }
};
export const commentController = {
    createComment,
    getCommentById,
    getCommentByAuthorId,
    deleteComment,
    updateComment,
    moderateComment
};
//# sourceMappingURL=comment.controller.js.map