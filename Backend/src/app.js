// app.js - Main app configuration
import express from 'express';
import cookieParser from "cookie-parser";
import cors from 'cors';
import morgan from "morgan";
import { logger, errorHandler } from './Utils/logger.js';

// Middleware
const app = express();

// Serve static files from the "public" directory (usually used for frontend)
app.use(express.static('public'));

// Enable CORS (Cross-Origin Resource Sharing)
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
}));

// Parse incoming request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie Parser Middleware
app.use(cookieParser());

// Logging request info using Winston for every request
const morganFormat = ":method :url :status :response-time ms";
logger.info("Server logger initialized ✅");

app.use(
    morgan(morganFormat, {
        stream: {
            write: (message) => {
                // Create a structured log message
                const logObject = {
                    method: message.split(" ")[0],
                    url: message.split(" ")[1],
                    status: message.split(" ")[2],
                    responseTime: message.split(" ")[3],
                };

                // Log the request details using Winston
                logger.info(`Request: ${JSON.stringify(logObject)}`);
            },
        },
    })
);

// Routes (make sure these are imported and added correctly)
import postRouter from "./routes/post.routes.js";
import UserRouter from './routes/user.routes.js';
import likeRouter from './routes/like.routes.js';
import commentRouter from './routes/comment.routes.js';
import subscriptionRouter from "./routes/subscription.routes.js";
import bookmarkRouter from "./routes/bookmark.routes.js";
import chatRouter from "./routes/chat.routes.js"
import messageRouter from "./routes/message.routes.js"
// Add routes
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/like", likeRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/subscription", subscriptionRouter);
app.use("/api/v1/bookmark", bookmarkRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/message", messageRouter);



// log eror
app.use(errorHandler);

// Export the app for use
export default app;
