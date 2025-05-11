
// authSlice
import authReducer, { loginUser, jwtRefreshToken, logoutUser, resendEmailVerification, Googleauthentication, } from "./auth/authSlice"

// userslice
import userReducer, { createUser, deleteUser, getCurrentUser, search, updateUserAccountDetails, updateUserProfileImage, updateUserCoverImage, getUserPost, getUserDetails, getRandomUser } from "./user/userSlice"

// postSlice
import postReducer from "./post/postSlice"

// like slice
import likeReducer, { toggleCommentLike, togglePostLike, getAllLikeComment, getAllLikePost } from "./like/likeSlice"

// subscriptionSlice
import subscriptionReducer from "./subscription/subscriptionSlice"

// bookmarkSlice
import bookmarkReducer from "./bookmark/bookmarkSlice"

// comment
import commentReducer, { createComment, updateComment, deleteComment, getAllPostComments, getCommentReplies, createReplyComment, getComment, getAllUserComment } from "./comment/commentSlice"

import chatReducer, { accessChat, fetchChat ,setSelectedChat} from "./chat/chatSlice"

import messageReducer,{getAllMessages,sendMessage,clearMessages,addMessageRealtime} from "./message/messageSlice"
export {
    authReducer,
    loginUser,
    jwtRefreshToken,
    logoutUser,
    resendEmailVerification,
    Googleauthentication,

    userReducer,
    createUser,
    deleteUser,
    getCurrentUser,
    search,
    updateUserAccountDetails,
    updateUserCoverImage,
    updateUserProfileImage,
    getUserPost,
    getUserDetails,
    getRandomUser,

    likeReducer,
    toggleCommentLike,
    togglePostLike,
    getAllLikeComment,
    getAllLikePost,

    commentReducer,
    createComment,
    updateComment,
    deleteComment,
    getAllPostComments,
    getCommentReplies,
    createReplyComment,
    getComment,
    getAllUserComment,


    bookmarkReducer,
    postReducer,
    subscriptionReducer,

    chatReducer,
    accessChat,
    fetchChat,
    setSelectedChat,

    messageReducer,
    clearMessages,
    getAllMessages,
    sendMessage,
    addMessageRealtime

    
}