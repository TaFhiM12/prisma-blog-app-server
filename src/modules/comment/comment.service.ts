import { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const createComment = async(payload:{
    content: string;
    authorId: string;
    postId: string;
    parentId?: string;
}) => {

    const postData = await prisma.post.findUniqueOrThrow({
        where: {
            id : payload.postId
        }
    })

    if(payload.parentId){
        const parentData = await prisma.comment.findUniqueOrThrow({
            where:{
                id: payload.parentId
            }
        })
    }
    return await prisma.comment.create({
        data: payload
    })
}

const getCommentById = async(commentId: string) => {
    return await prisma.comment.findUniqueOrThrow({
        where:{
            id : commentId
        },
        include:{
            post: {
                select:{
                    id: true,
                    title: true
                }
            }
        }
    })
}

const getCommentByAuthorId = async(authorId: string) => {
    return await prisma.comment.findMany({
        where:{
            authorId
        },
        orderBy:{
            createdAt: "desc"
        },
        include:{
            post:{
                select:{
                    id: true,
                    title: true
                }
            }
        }
    })
}

const deleteComment = async(commentId: string, authorId: string) => {
    const commentData = await prisma.comment.findFirst({
        where:{
            id: commentId,
            authorId
        }
    })
    if(!commentData){
        throw new Error("Not found");
    }

    return await prisma.comment.delete({
        where:{
            id: commentData.id
        }
    })
}

const updateComment = async(authorId: string, data:{content?: string, staus?: CommentStatus}, commentId: string) => {
    console.log(authorId,data, commentId)
    const commentData = await prisma.comment.findFirst({
        where:{
            id: commentId,
            authorId
        }
    })
    if(!commentData){
        throw new Error("Not found");
    }

    return await prisma.comment.update({
        where:{
            id: commentId
        },
        data
    })
}

const moderateComment = async(id: string, data:{status: CommentStatus}) => {
    const commentData = await prisma.comment.findFirstOrThrow({
        where:{
            id
        },
        select:{
            id: true,
            status: true
        }
    })
    
    if(commentData.status === data.status){
        throw new Error(`Your provided ${data.status} already up to date`);
    }
    return await prisma.comment.update({
        where:{
            id
        },
        data
    })
}

export const commentServices = {
    createComment,
    getCommentById,
    getCommentByAuthorId,
    deleteComment,
    updateComment,
    moderateComment
}