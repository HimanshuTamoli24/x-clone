import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import database from "./config/db.js";
import dotenv from "dotenv";
import { sendMessage } from "./controllers/message.controller.js";

dotenv.config();
database(process.env.MONGODB_URI);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    },
});

const user = {}
io.on("connection", (socket) => {
    console.log("🟢 New client connected:", socket.id);

    // When user connects, send their userId
    socket.on("register", (userId) => {
        user[userId] = socket.id;
        console.log(`User ${userId} registered with socket ID ${socket.id}`);
    });


    socket.on("send", ({ sender, reciever, message }) => {
        console.log("MESSAGE", sender, reciever, message);
        const receiverSocketId = user[reciever]
        console.log("cnkhwvjrjv", receiverSocketId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("receive", {
                sender,
                message: message + Date.now()
            });
        }

    })

    socket.on("disconnect", () => {
        console.log("🔴 Client disconnected:", socket.id);
    });
});
console.log("userrrrrrrrrrrrrrrrrrrrr", user);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
