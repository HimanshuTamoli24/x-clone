import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userServices } from "../../service"


const createUser = createAsyncThunk("createUser", userServices.createUser)
const deleteUser = createAsyncThunk("deleteUser", userServices.deleteUser)
const getCurrentUser = createAsyncThunk("getCurrentUser", userServices.getCurrentUser)
const search = createAsyncThunk("search", userServices.search)
const updateUserAccountDetails = createAsyncThunk("updateUserAccountDetails", userServices.updateUserAccountDetails)
const updateUserCoverImage = createAsyncThunk("updateUserCoverImage", userServices.updateUserCoverImage)
const updateUserProfileImage = createAsyncThunk("updateUserProfileImage", userServices.updateUserProfileImage)
const getUserPost = createAsyncThunk("getUserPost", userServices.getUserPost)
const getUserDetails = createAsyncThunk("getUserDetails", userServices.getUserDetails)
const getRandomUser = createAsyncThunk("getRandomUser", userServices.getRandomUser)

const initialState = {
    searchResults: [],
    userPost: [],
    randomUser: [],
    getUser: null,
    currentUser: null,
    error: null,
    loading: false,
    success: false,
    message: null,
}

const userSlice = createSlice({
    name: "userSlice",
    initialState,
    reducers: {
        resetSearchState: (state) => {
            state.searchResults = [];
            state.success = false;
            state.error = null;
            state.message = '';

        },
        resetUserState: () => initialState
    },

    extraReducers: (builder) => {
        builder
            .addCase(createUser.pending, (state) => {
                state.currentUser = null;
                state.error = null;
                state.loading = true;
                state.success = false;
                state.message = null;
            })
            .addCase(createUser.rejected, (state, action) => {
                state.currentUser = null;
                state.error = action.error.message;
                state.loading = false;
                state.success = false;
                state.message = "Failed to create user";
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.currentUser = action.payload;
                state.error = null;
                state.loading = false;
                state.success = true;
                state.message = "User created successfully";
            })

            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
                state.message = null;
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
                state.success = false;
                state.message = "Failed to delete user";
            })
            .addCase(deleteUser.fulfilled, (state) => {
                state.currentUser = null;
                state.error = null;
                state.loading = false;
                state.success = true;
                state.message = "User deleted successfully";
            })

            .addCase(getCurrentUser.pending, (state) => {
                state.error = null;
                state.loading = true;
                state.success = false;
                state.message = null;
            })
            .addCase(getCurrentUser.rejected, (state, action) => {
                state.currentUser = null;
                state.error = action.error.message;
                state.loading = false;
                state.success = false;
                state.message = "Failed to fetch current user";
            })
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.currentUser = action.payload;
                state.error = null;
                state.loading = false;
                state.success = true;
                state.message = "Current user fetched successfully";
            })

            .addCase(getRandomUser.pending, (state) => {
                state.error = null;
                state.loading = true;
                state.success = false;
                state.message = null;
            })
            .addCase(getRandomUser.rejected, (state, action) => {
                state.currentUser = null;
                state.error = action.error.message;
                state.loading = false;
                state.success = false;
                state.message = "Failed to fetch RandomUser user";
            })
            .addCase(getRandomUser.fulfilled, (state, action) => {
                state.randomUser = action.payload;
                state.error = null;
                state.loading = false;
                state.success = true;
                state.message = "random user fetched successfully";
            })

            // get user
            .addCase(getUserDetails.pending, (state) => {
                state.error = null;
                state.loading = true;
                state.success = false;
                state.message = null;
            })
            .addCase(getUserDetails.rejected, (state, action) => {
                state.currentUser = null;
                state.error = action.error.message;
                state.loading = false;
                state.success = false;
                state.message = "Failed to fetch current user";
            })
            .addCase(getUserDetails.fulfilled, (state, action) => {
                state.getUser = action.payload;
                state.error = null;
                state.loading = false;
                state.success = true;
                state.message = "Current user fetched successfully";
            })

            .addCase(search.pending, (state) => {
                state.searchResults = [];
                state.error = null;
                state.loading = true;
                state.success = false;
                state.message = null;
            })
            .addCase(search.rejected, (state, action) => {
                state.searchResults = [];
                state.error = action.error.message;
                state.loading = false;
                state.success = false;
                state.message = "Search failed";
            })
            .addCase(search.fulfilled, (state, action) => {
                state.searchResults = action.payload;
                state.error = null;
                state.loading = false;
                state.success = true;
                state.message = "Search completed successfully";
            })

            .addCase(getUserPost.pending, (state) => {
                state.userPost = [];
                state.error = null;
                state.loading = true;
                state.success = false;
                state.message = null;
            })
            .addCase(getUserPost.rejected, (state, action) => {
                state.userPost = [];
                state.error = action.error.message;
                state.loading = false;
                state.success = false;
                state.message = "Search failed";
            })
            .addCase(getUserPost.fulfilled, (state, action) => {
                state.userPost = action.payload;
                state.error = null;
                state.loading = false;
                state.success = true;
                state.message = "Search completed successfully";
            })

            .addCase(updateUserAccountDetails.pending, (state) => {
                state.error = null;
                state.loading = true;
                state.success = false;
                state.message = null;
            })
            .addCase(updateUserAccountDetails.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
                state.success = false;
                state.message = "Failed to update account details";
            })
            .addCase(updateUserAccountDetails.fulfilled, (state, action) => {
                // look at this once again here
                if (state.currentUser) {
                    state.currentUser.fullName = action.payload.fullName;
                    state.currentUser.email = action.payload.email;
                    state.currentUser.bio = action.payload.bio;
                    state.currentUser.link = action.payload.link;
                    state.currentUser.userName = action.payload.userName;
                }
                state.error = null;
                state.loading = false;
                state.success = true;
                state.message = "Account details updated successfully";
            })

            .addCase(updateUserProfileImage.pending, (state) => {
                state.error = null;
                state.loading = true;
                state.success = false;
                state.message = null;
            })
            .addCase(updateUserProfileImage.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
                state.success = false;
                state.message = "Failed to update profile image";
            })
            .addCase(updateUserProfileImage.fulfilled, (state, action) => {
                if (state.currentUser) {
                    state.currentUser.profileImage = action.payload.profileImage;
                }
                state.error = null;
                state.loading = false;
                state.success = true;
                state.message = "Profile image updated successfully";
            })

            .addCase(updateUserCoverImage.pending, (state) => {
                state.error = null;
                state.loading = true;
                state.success = false;
                state.message = null;
            })
            .addCase(updateUserCoverImage.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
                state.success = false;
                state.message = "Failed to update cover image";
            })
            .addCase(updateUserCoverImage.fulfilled, (state, action) => {
                if (state.currentUser) {
                    state.currentUser.coverImage = action.payload.coverImage;
                }
                state.error = null;
                state.loading = false;
                state.success = true;
                state.message = "Cover image updated successfully";
            })
    }
})


export {
    createUser,
    deleteUser,
    getCurrentUser,
    search,
    updateUserAccountDetails,
    updateUserCoverImage,
    updateUserProfileImage,
    getUserPost,
    getUserDetails,
    getRandomUser

}
export const { resetSearchState, resetUserState } = userSlice.actions;
export default userSlice.reducer
