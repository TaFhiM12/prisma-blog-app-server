import { Request, Response } from "express";
import { postServices } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationHelper from "../../helper/paginationHelper";

const createPost = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(400).send({
                error: "Unauthorized"
            })
        }
        console.log(req.user)
        const result = await postServices.createPost(req.body, user.id as string)
        res.status(201).send({
            "message": "post created",
            "data": result
        })
    } catch (error) {
        res.status(400).send({
            "message": "post not created",
            "details": error
        })
    }
}

const getAllPost = async (req: Request, res: Response) => {
    try {
        const search = req.query.search;
        const searchType = typeof search === 'string' ? search : undefined
        const tags = req.query.tags ? (req.query.tags as string).split(',') : [];
        const isFeatured = req.query.isFeatured
            ? req.query.isFeatured === 'true'
                ? true
                : req.query.isFeatured === 'false'
                    ? false
                    : undefined
            : undefined;
        const status = req.query.status as PostStatus | undefined;
        const authorId = req.query.authorId as string | undefined;
        const { page, limit, skip, sortBy, sortOrder } = paginationHelper(req.query)
        const result = await postServices.getAllPost({ search: searchType, tags, isFeatured, status, authorId, page, limit, skip, sortBy, sortOrder });
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({
            message: "Post not Found"
        })
    }
}

const getPostById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        if (!id) {
            throw new Error("Id is Required")
        }
        const result = await postServices.getPostById(id)
        res.send(result);
    } catch (error) {
        res.status(400).send({
            "message": "post not created",
            "details": error
        })
    }
}

const getMyPosts = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const result = await postServices.getMyPosts(user?.id as string)
        res.status(200).json(result)
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch posts",
            details: error instanceof Error ? error.message : error
        });
    }
}

const updatePost = async(req: Request, res: Response) => {
    try {
        const user = req.user;
        console.log(user)
        const {postId} = req.params;
        const isAdmin = user?.role === "ADMIN" ? true : false;
        const result = await postServices.updatePost(postId as string, req.body, user?.id as string, isAdmin);
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({
            message: error instanceof Error ? error.message : 'Post updation process failed'
        })
    }
}

const deletePost = async(req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        const user = req.user;
        const isAdmin = user?.role === 'ADMIN';
        const result = await postServices.deletePost(postId as string, user?.id as string, isAdmin)
        res.status(200).json(result)
    } catch (error) {
        res.status(404).json({
            message: error instanceof Error ? error.message : 'Post Deletion process failed'
        })
    }
}

export const postController = {
    createPost,
    getAllPost,
    getPostById,
    getMyPosts,
    updatePost,
    deletePost
}