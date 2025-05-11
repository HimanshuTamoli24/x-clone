import axios from "axios";
import { messageBaseUrl } from "../constants"; 

class MessageService {
    async sendMessage({chatId, content}) {
        try {
            const response = await axios.post(
                `${messageBaseUrl}/${chatId}`,
                { content },
                { withCredentials: true }
            );
            console.log("MessageService :: sendMessage :: response", response.data);
            return response.data;
        } catch (error) {
            console.error("MessageService :: sendMessage :: error", error.response?.data?.message);
            throw new Error(`MessageService :: sendMessage :: ${error.response?.data?.message || "Something went wrong while sending message"}`);
        }
    }

    async getAllMessages(chatId) {
        try {
            const response = await axios.get(
                `${messageBaseUrl}/${chatId}`,
                { withCredentials: true }
            );
            console.log("MessageService :: getAllMessages :: response", response.data);
            return response.data;
        } catch (error) {
            console.error("MessageService :: getAllMessages :: error", error.response?.data?.message);
            throw new Error(`MessageService :: getAllMessages :: ${error.response?.data?.message || "Something went wrong while fetching messages"}`);
        }
    }
}

const messageService = new MessageService();
export { messageService };
