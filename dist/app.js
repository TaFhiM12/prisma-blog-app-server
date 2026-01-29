import express from 'express';
import { postRouter } from './modules/post/post.router';
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';
import cors from 'cors';
import { commentRouter } from './modules/comment/comment.router';
import { statsRouter } from './modules/statistics/stat.router';
const app = express();
app.use(cors({
    origin: process.env.APP_URL,
    credentials: true,
}));
app.all('/api/auth/{*any}', toNodeHandler(auth));
app.use(express.json());
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/stats', statsRouter);
app.get('/', (req, res) => {
    res.send("Blog app server running");
});
export default app;
//# sourceMappingURL=app.js.map