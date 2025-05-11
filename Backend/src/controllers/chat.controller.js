import Chat from "../models/chat.model.js";
import ApiErrors from "../utils/ApiErrors.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId) throw new ApiErrors(400, "User ID is required");

    let chat = await Chat.findOne({
        users: { $all: [req.user._id, userId] }
    })
        .populate("users", "-password -refreshToken")
        .populate("latestMessage");

    if (chat) {
        return res.status(200).json(
            new ApiResponse(200, "Chat accessed successfully", chat)
        );
    }

    // No existing chat found, so create one
    const newChat = await Chat.create({
        chatName: "sender",
        users: [req.user._id, userId]
    });

    chat = await Chat.findById(newChat._id)
        .populate("users", "-password -refreshToken")
        .populate("latestMessage");

    res.status(200).json(new ApiResponse(200, "Chat created successfully", chat));
});


const fetchChat = asyncHandler(async (req, res) => {
    const chat = await Chat.find({ users: req.user._id })
        .populate("users", "-password -refreshToken")
        .populate("latestMessage")
        .sort({ updatedAt: -1 });

    return res.status(200).json(new ApiResponse(200, "All chats fetched successfully", chat));
});


export {
    accessChat,
    fetchChat
} 