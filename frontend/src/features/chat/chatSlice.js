// redux/slices/chat.slice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { chatService } from "../../service/chatService.js";

// Thunks
const accessChat = createAsyncThunk("chat/accessChat", chatService.accessChat);
const fetchChat = createAsyncThunk("chat/fetchChats", chatService.fetchChats);

const initialState = {
    chats: [],
    selectedChat: null,
    loading: false,
    error: null,
    message: null,
    status: null,
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        clearChatStatus: (state) => {
            state.message = null;
            state.status = null;
            state.error = null;
        },
        setSelectedChat: (state, action) => {
            state.selectedChat = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Access Chat
            .addCase(accessChat.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.status = null;
            })
            .addCase(accessChat.fulfilled, (state, action) => {
                state.selectedChat = action.payload;
                state.message = action.payload.message;
                state.status = true;
                state.loading = false;
            })
            .addCase(accessChat.rejected, (state, action) => {
                state.error = action.error.message;
                state.status = false;
                state.loading = false;
            })

            // Fetch All Chats
            .addCase(fetchChat.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.status = null;
            })
            .addCase(fetchChat.fulfilled, (state, action) => {
                state.chats = action.payload;
                state.message = action.payload.message;
                state.status = true;
                state.loading = false;
            })
            .addCase(fetchChat.rejected, (state, action) => {
                state.error = action.error.message;
                state.status = false;
                state.loading = false;
            });
    }
});

export default chatSlice.reducer;
export const { clearChatStatus, setSelectedChat } = chatSlice.actions;
export { accessChat, fetchChat };
