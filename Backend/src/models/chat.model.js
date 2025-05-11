import { model, Schema } from "mongoose";

const chatSchema = new Schema({
    chatName: { type: String, trim: true },

    users: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],

    latestMessage: {
        type: Schema.Types.ObjectId,
        ref: "Message"
    },
}, { timestamps: true })

const Chat =  model("Chat", chatSchema)
export default Chat