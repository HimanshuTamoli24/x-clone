import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { messageService } from "../../service/messageService.js";

// Thunks
const sendMessage = createAsyncThunk("message/sendMessage", messageService.sendMessage);

const getAllMessages = createAsyncThunk("message/getAllMessages", messageService.getAllMessages);

// Initial State
const initialState = {
    messages: [],
    loading: false,
    message: null,
    status: null,
    error: null,
};

// Slice
const messageSlice = createSlice({
    name: "message",
    initialState,
    reducers: {
        clearMessages: (state) => {
            state.messages = [];
            state.message = null;
            state.error = null;
            state.status = null;
        },

        addMessageRealtime: (state, action) => {
            state.messages.push(action.payload);
            // state.messages = [...state.messages, action.payload];    
        },
    },
    extraReducers: (builder) => {
        builder
            // Send Message
            .addCase(sendMessage.pending, (state) => {
                state.loading = true;
                state.message = null;
                state.error = null;
                state.status = null;
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.loading = false;
                state.message = "Failed to send message";
                state.error = action.error.message;
                state.status = false;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.loading = false;
                state.status = true;
                state.message = action.payload.message;
                state.messages.push(action.payload.data.latestMessage); // Add latest message to list
            })

            // Get All Messages
            .addCase(getAllMessages.pending, (state) => {
                state.loading = true;
                state.message = null;
                state.error = null;
                state.status = null;
            })
            .addCase(getAllMessages.rejected, (state, action) => {
                state.loading = false;
                state.message = "Failed to fetch messages";
                state.error = action.error.message;
                state.status = false;
            })
            .addCase(getAllMessages.fulfilled, (state, action) => {
                state.loading = false;
                state.status = true;
                state.messages = action.payload.data;
                state.message = action.payload.message;
            });
    },
});

export default messageSlice.reducer;
export const { clearMessages,addMessageRealtime } = messageSlice.actions;
export { sendMessage, getAllMessages };
