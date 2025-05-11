
import Message from "../models/message.model.js";
import Chat from "../models/chat.model.js";
import ApiErrors from "../utils/ApiErrors.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const sendMessage = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const { chatId } = req.params;
    // console.log("chatid",chatId,content)
    // Check if content or chatId is missing
    if (!content.trim() || !chatId) {
        throw new ApiErrors(400, "Content or chatId missing!");
    }

    // Create the new message in the database
    const newMessage = await Message.create({
        sender: req.user._id,    // Logged-in user's ID
        content,
        chat: chatId
    });

    // If the message wasn't created successfully, throw an error
    if (!newMessage) {
        throw new ApiErrors(500, "Failed to send message!");
    }

    // Update the chat with the latest message
    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        { latestMessage: newMessage._id }, // Store the latest message ID in the chat
        { new: true } // Return the updated chat
    )
        .populate("latestMessage") // Populate the latest message details
        // .populate("sender", "profileImage fullName userName"); // Populate sender details

    // If chat not found, throw an error
    if (!updatedChat) {
        throw new ApiErrors(404, "Chat not found!");
    }

    // Return the updated chat with the latest message
    res.status(200).json(new ApiResponse(200, "Message sent successfully", updatedChat));
});



const allMessage = asyncHandler(async (req, res) => {
    const { chatId } = req.params;

    if (!chatId) {
        throw new ApiErrors(400, "Chat ID is missing!");
    }

    const messages = await Message.find({ chat: chatId })
        .populate("sender", "profileImage fullName userName")
        .sort({ createdAt: 1 }); // Optional: oldest to newest

    res.status(200).json(new ApiResponse(200, "Fetched all messages", messages));
});



export {
    sendMessage, allMessage
}