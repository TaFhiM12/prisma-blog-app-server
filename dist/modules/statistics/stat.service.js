import { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
const getStat = async () => {
    return await prisma.$transaction(async (tx) => {
        const [totalPosts, publishedPostss, draftPosts, archivePosts, totalComment, totalApprovedComment, totalRejectComment, userCount, adminRoleCount, userRoleCount, viewsCount] = await Promise.all([
            await tx.post.count(),
            await tx.post.count({ where: { status: "PUBLISHED" } }),
            await tx.post.count({ where: { status: "DRAFT" } }),
            await tx.post.count({ where: { status: "ARCHIVED" } }),
            await tx.comment.count(),
            await tx.comment.count({ where: { status: CommentStatus.APPROVED } }),
            await tx.comment.count({ where: { status: CommentStatus.REJECT } }),
            await tx.user.count(),
            await tx.user.count({ where: { role: "ADMIN" } }),
            await tx.user.count({ where: { role: "USER" } }),
            await tx.post.aggregate({
                _sum: {
                    views: true
                }
            })
        ]);
        return {
            totalPosts,
            publishedPostss,
            draftPosts,
            archivePosts,
            totalComment,
            totalApprovedComment,
            totalRejectComment,
            userCount,
            adminRoleCount,
            userRoleCount,
            viewsCount: viewsCount._sum.views
        };
    });
};
export const statService = {
    getStat
};
//# sourceMappingURL=stat.service.js.map