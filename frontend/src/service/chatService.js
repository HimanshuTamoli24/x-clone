import axios from "axios";
import { chatBaseUrl } from "../constants";

class ChatService {
    async accessChat(userId) {
        try {
            const response = await axios.post(`${chatBaseUrl}/${userId}`, {}, {
                withCredentials: true
            });
            console.log("ChatService :: accessChat :: response", response.data);
            return response.data;
        } catch (error) {
            console.error("ChatService :: accessChat :: error", error.response?.data?.message);
            throw new Error(`ChatService :: accessChat :: ${error.response?.data?.message || "Something went wrong"}`);
        }
    }

    async fetchChats() {
        try {
            const response = await axios.get(`${chatBaseUrl}/`, {
                withCredentials: true
            });
            console.log("ChatService :: fetchChats :: response", response.data);
            return response.data;
        } catch (error) {
            console.error("ChatService :: fetchChats :: error", error.response?.data?.message);
            throw new Error(`ChatService :: fetchChats :: ${error.response?.data?.message || "Something went wrong"}`);
        }
    }
}

const chatService = new ChatService();
export { chatService };
