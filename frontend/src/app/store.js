import { configureStore } from "@reduxjs/toolkit"
import { authReducer, userReducer, postReducer, likeReducer, subscriptionReducer, bookmarkReducer, commentReducer, chatReducer, messageReducer } from "../features"
const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        post: postReducer,
        like: likeReducer,
        subscription: subscriptionReducer,
        bookmark: bookmarkReducer,
        comment: commentReducer,
        chat: chatReducer,
        message: messageReducer

    }
})


export default store