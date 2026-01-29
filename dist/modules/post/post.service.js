import { prisma } from "../../lib/prisma";
import { CommentStatus } from '../../../generated/prisma/enums';
const createPost = async (data, userId) => {
    const result = await prisma.post.create({
        data: {
            ...data,
            authorId: userId
        }
    });
    return result;
};
const getAllPost = async ({ search, tags, isFeatured, status, authorId, page, limit, skip, sortBy, sortOrder }) => {
    const andCondition = [];
    const tagsLower = tags.map(t => t.toLocaleLowerCase());
    if (search) {
        andCondition.push({
            OR: [
                {
                    title: {
                        contains: search,
                        mode: "insensitive"
                    }
                },
                {
                    content: {
                        contains: search,
                        mode: "insensitive"
                    }
                },
                {
                    tags: {
                        has: search
                    }
                }
            ]
        });
    }
    if (tags.length > 0) {
        andCondition.push({
            tags: {
                hasEvery: tagsLower,
            }
        });
    }
    if (typeof isFeatured === 'boolean') {
        andCondition.push({ isFeatured });
    }
    if (status) {
        andCondition.push({
            status
        });
    }
    if (authorId) {
        andCondition.push({
            authorId
        });
    }
    const result = await prisma.post.findMany({
        take: limit,
        skip,
        where: {
            AND: andCondition
        },
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            _count: {
                select: {
                    comments: true
                }
            }
        }
    });
    const totalData = await prisma.post.count({
        where: {
            AND: andCondition
        }
    });
    const totalPages = Number(Math.ceil(totalData / limit));
    return {
        data: result,
        pagination: {
            totalData,
            page,
            limit,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
        }
    };
};
const getPostById = async (postId) => {
    return await prisma.$transaction(async (tx) => {
        await tx.post.update({
            where: {
                id: postId
            },
            data: {
                views: {
                    increment: 1
                }
            }
        });
        const postData = await tx.post.findUnique({
            where: {
                id: postId
            },
            include: {
                comments: {
                    where: {
                        parentId: null,
                        status: CommentStatus.APPROVED
                    },
                    orderBy: {
                        createdAt: "desc"
                    },
                    include: {
                        replies: {
                            where: {
                                status: CommentStatus.APPROVED
                            },
                            orderBy: {
                                createdAt: "asc"
                            },
                            include: {
                                replies: {
                                    where: {
                                        status: CommentStatus.APPROVED
                                    },
                                    orderBy: {
                                        createdAt: "asc"
                                    }
                                }
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        comments: true
                    }
                }
            }
        });
        return postData;
    });
};
const getMyPosts = async (authorId) => {
    await prisma.user.findUniqueOrThrow({
        where: {
            id: authorId,
            status: "ACTIVE"
        }
    });
    return prisma.post.findMany({
        where: { authorId },
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: {
                    comments: true
                }
            }
        }
    });
};
const updatePost = async (postId, data, authorId, isAdmin) => {
    const postData = await prisma.post.findFirstOrThrow({
        where: {
            id: postId
        },
        select: {
            id: true,
            authorId: true
        }
    });
    if (!isAdmin && postData.authorId !== authorId) {
        throw new Error('this is not you post');
    }
    const updateData = { ...data };
    if (!isAdmin) {
        delete updateData.isFeatured;
    }
    return await prisma.post.update({
        where: {
            id: postData.id
        },
        data: updateData
    });
};
const deletePost = async (postId, authorId, isAdmin) => {
    const postData = await prisma.post.findFirstOrThrow({
        where: {
            id: postId
        },
        select: {
            id: true,
            authorId: true
        }
    });
    if (!isAdmin && postData.authorId !== authorId) {
        throw new Error('this is not you post');
    }
    return prisma.post.delete({
        where: {
            id: postId
        }
    });
};
export const postServices = {
    createPost,
    getAllPost,
    getPostById,
    getMyPosts,
    updatePost,
    deletePost
};
//# sourceMappingURL=post.service.js.map