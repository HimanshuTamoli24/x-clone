
// authSlice
import authReducer, { loginUser, jwtRefreshToken, logoutUser, resendEmailVerification, Googleauthentication, } from "./auth/authSlice"

// userslice
import userReducer, { createUser, deleteUser, getCurrentUser, search, updateUserAccountDetails, updateUserProfileImage, updateUserCoverImage } from "./user/userSlice"

// postSlice
import postReducer from "./post/postSlice"

// like slice
import likeReducer, { toggleCommentLike, togglePostLike, getAllLikeComment, getAllLikePost } from "./like/likeSlice"

// subscriptionSlice
import subscriptionReducer from "./subscription/subscriptionSlice"

// bookmarkSlice
import bookmarkReducer from "./bookmark/bookmarkSlice"

// comment
import commentReducer, { createComment, updateComment, deleteComment, getAllPostComments, getCommentReplies, createReplyComment } from "./comment/commentSlice"

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


    bookmarkReducer,
    postReducer,
    subscriptionReducer,
}