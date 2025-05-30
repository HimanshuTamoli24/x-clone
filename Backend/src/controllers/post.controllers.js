import ApiErrors from "../utils/ApiErrors.js"
import ApiResponse from "../utils/ApiResponse.js"
import { Post } from "../models/post.model.js"
// import User from "../models/User.model.js"
import asyncHandler from "../utils/asyncHandler.js"
import { deleteCloudinary, uploadCloudinary } from "../utils/cloudinary.js"
import mongoose, { isValidObjectId } from "mongoose"
import { Subscription } from "../models/subscription.model.js"
import User from "../models/user.model.js"
import Like from "../models/like.model.js"

// fn for create post
const createPost = asyncHandler(async (req, res) => {
    const { text } = req.body

    if (!text.trim()) {
        throw new ApiErrors(400, "Text field is required")
    }

    const mediaLocalFile = req.file?.path

    // if media file attached
    if (mediaLocalFile) {
        const mediaFile = await uploadCloudinary(mediaLocalFile)

        if (!mediaFile) {
            throw new ApiErrors(400, "Something wrong while uploading the media, Please try later!")
        }

        const newPost = await Post.create({
            createdBy: req.user._id,
            text,
            media: {
                url: mediaFile.secure_url,
                publicId: mediaFile.public_id,
                resourseType: mediaFile.resource_type
            }
        })

        if (!newPost) {
            throw new ApiErrors(400, "Failed to create a new post!")
        }

        await newPost.populate({
            path: "createdBy",
            select: "-password -coverImage -refreshToken -isGoogleUser",
        });

        return res.status(200).json(new ApiResponse(200, "Post created successfully.", newPost))

    }

    const newPost = await Post.create({
        createdBy: req.user._id,
        text
    })

    if (!newPost) {
        throw new ApiErrors(400, "Failed to create a new post!")
    }

    await newPost.populate({
        path: "createdBy",
        select: "-password -coverImage -refreshToken -isGoogleUser",
    });

    return res.status(200).json(new ApiResponse(200, "Post created successfully.", newPost))

})


// fn for update post
const updatePost = asyncHandler(async (req, res) => {

    const { text } = req.body
    const { postId } = req.params

    if (!text?.trim()) {
        throw new ApiErrors(400, "Text field is required")
    }

    if (!postId) {
        throw new ApiErrors(400, "Post id is required!")
    }

    if (!isValidObjectId(postId)) {
        throw new ApiErrors(400, "Invalid Id!")
    }

    const post = await Post.findById(postId)

    if (!post) {
        throw new ApiErrors(404, "post not found!")
    }

    post.text = text
    await post.save({ ValidityState: false })

    return res.status(200).json(new ApiResponse(200, "Post updated successfully.", post))

})

// fn for get post by id
const getPostById = asyncHandler(async (req, res) => {
    const { postId } = req.params

    if (!postId) {
        throw new ApiErrors(400, "Post id is required!")
    }

    if (!isValidObjectId(postId)) {
        throw new ApiErrors(400, "Invalid Id!")
    }

    // const post =  await Post.findById(postId)
    const post = await Post.aggregate([

        {
            $match: { _id: new mongoose.Types.ObjectId(postId) }
        },

        {
            $lookup: {
                from: "users",
                localField: "createdBy",
                foreignField: "_id",
                as: "user",
                pipeline: [
                    {
                        $lookup: {
                            from: "subscriptions",
                            localField: "_id",
                            foreignField: "follower",
                            as: "followingDoc"
                        },
                    },
                    {
                        $lookup: {
                            from: "subscriptions",
                            localField: "_id",
                            foreignField: "following",
                            as: "followerDoc"
                        },
                    }
                ]
            }
        },
        {
            $unwind: "$user"
        },
        {
            $addFields: {
                userDetails: {
                    userId: "$user._id",
                    username: "$user.userName",
                    fullName: "$user.fullName",
                    profileImage: "$user.profileImage",
                    bio: "$user.bio",
                    follower: { $size: "$user.followerDoc" },
                    following: { $size: "$user.followingDoc" },
                    isFollowed: {
                        $cond: {
                            if: { $in: [req.user._id, "$user.followerDoc.follower"] },
                            then: true,
                            else: false
                        }
                    }
                }

            }
        },

        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "post",
                as: "likedDoc",
            }
        },

        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "post",
                as: "commentDoc"
            }
        },

        {
            $lookup: {
                from: "bookmarks",
                localField: "_id",
                foreignField: "post",
                as: "bookmarkedDoc"
            }
        },

        {
            $addFields: {
                likeCount: { $size: "$likedDoc" },
                isLiked: {
                    $cond: {
                        if: { $in: [req.user._id, "$likedDoc.likedBy"] },
                        then: true,
                        else: false
                    }
                },
                commentCount: { $size: "$commentDoc" },
                isBookmarked: {
                    $cond: {
                        if: { $in: [req.user._id, "$bookmarkedDoc.bookmarkedBy"] },
                        then: true,
                        else: false
                    }
                }
            }
        },

        {
            $project: {
                text: 1,
                media: 1,
                views: 1,
                likeCount: 1,
                commentCount: 1,
                isLiked: 1,
                isBookmarked: 1,
                userDetails: 1,
                createdAt: 1,
                updatedAt: 1
            }
        }

    ])


    if (post.length === 0) {
        throw new ApiErrors(404, "Post not Fount!")
    }

    return res.status(200).json(new ApiResponse(200, "Post fetched successfully.", post[0]))

})


// fn for get all post
const getAllPost = asyncHandler(async (req, res) => {

    const { page = 1, limit = 20, } = req.query

    const allPosts = await Post.aggregate([
        {
            $match: {}
        },
        {
            $lookup: {
                from: "users",
                localField: "createdBy",
                foreignField: "_id",
                as: "user",
                pipeline: [
                    {
                        $lookup: {
                            from: "subscriptions",
                            localField: "_id",
                            foreignField: "follower",
                            as: "followingDoc"
                        },
                    },
                    {
                        $lookup: {
                            from: "subscriptions",
                            localField: "_id",
                            foreignField: "following",
                            as: "followerDoc"
                        },
                    }
                ]
            }
        },
        {
            $unwind: "$user"
        },
        {
            $addFields: {
                userDetails: {
                    userId: "$user._id",
                    username: "$user.userName",
                    fullName: "$user.fullName",
                    profileImage: "$user.profileImage",
                    bio: "$user.bio",
                    follower: { $size: "$user.followerDoc" },
                    following: { $size: "$user.followingDoc" },
                    isFollowed: {
                        $cond: {
                            if: { $in: [req.user._id, "$user.followerDoc.follower"] },
                            then: true,
                            else: false
                        }
                    }
                }

            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "post",
                as: "likedDoc",
            }
        },

        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "post",
                as: "commentDoc"
            }
        },

        {
            $lookup: {
                from: "bookmarks",
                localField: "_id",
                foreignField: "post",
                as: "bookmarkedDoc"
            }
        },

        {
            $addFields: {
                likeCount: { $size: "$likedDoc" },
                isLiked: {
                    $cond: {
                        if: { $in: [req.user._id, "$likedDoc.likedBy"] },
                        then: true,
                        else: false
                    }
                },
                commentCount: { $size: "$commentDoc" },
                isBookmarked: {
                    $cond: {
                        if: { $in: [req.user._id, "$bookmarkedDoc.bookmarkedBy"] },
                        then: true,
                        else: false
                    }
                }
            }
        },

        {
            $project: {
                text: 1,
                media: 1,
                views: 1,
                likeCount: 1,
                commentCount: 1,
                isLiked: 1,
                isBookmarked: 1,
                userDetails: 1,
                createdAt: 1,
                updatedAt: 1
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $skip: (Number(page) - 1) * Number(limit)
        },
        {
            $limit: Number(limit)
        }
    ])

    if (!allPosts) {
        throw new ApiErrors(400, "Failed to fetched the posts")
    }

    if (allPosts.length === 0) {
        return res.status(404).json(new ApiResponse(404, "Posts not found", []))
    }

    return res.status(200).json(new ApiResponse(200, "Posts fetched successfully", allPosts))

})


// fn for get user post
const getUserPost = asyncHandler(async (req, res) => {
    const { username } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const user = await User.findOne({ userName: username }); 
    if (!user) {
        throw new ApiErrors(404, "User not found!");
    }
    console.log("user",user)
    const userId = user?._id;

    if (!isValidObjectId(userId)) {
        throw new ApiErrors(400, "Invalid user id!");
    }


    const allPosts = await Post.aggregate([
        {
            $match: {
                createdBy: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "createdBy",
                foreignField: "_id",
                as: "user",
                pipeline: [
                    {
                        $lookup: {
                            from: "subscriptions",
                            localField: "_id",
                            foreignField: "follower",
                            as: "followingDoc"
                        },
                    },
                    {
                        $lookup: {
                            from: "subscriptions",
                            localField: "_id",
                            foreignField: "following",
                            as: "followerDoc"
                        },
                    }
                ]
            }
        },
        {
            $unwind: "$user"
        },
        {
            $addFields: {
                userDetails: {
                    userId: "$user._id",
                    username: "$user.userName",
                    fullName: "$user.fullName",
                    profileImage: "$user.profileImage",
                    bio: "$user.bio",
                    follower: { $size: "$user.followerDoc" },
                    following: { $size: "$user.followingDoc" },
                    isFollowed: {
                        $cond: {
                            if: { $in: [req.user._id, "$user.followerDoc.follower"] },
                            then: true,
                            else: false
                        }
                    }
                }

            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "post",
                as: "likedDoc",
            }
        },

        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "post",
                as: "commentDoc"
            }
        },

        {
            $lookup: {
                from: "bookmarks",
                localField: "_id",
                foreignField: "post",
                as: "bookmarkedDoc"
            }
        },

        {
            $addFields: {
                likeCount: { $size: "$likedDoc" },
                isLiked: {
                    $cond: {
                        if: { $in: [req.user._id, "$likedDoc.likedBy"] },
                        then: true,
                        else: false
                    }
                },
                commentCount: { $size: "$commentDoc" },
                isBookmarked: {
                    $cond: {
                        if: { $in: [req.user._id, "$bookmarkedDoc.bookmarkedBy"] },
                        then: true,
                        else: false
                    }
                }
            }
        },

        {
            $project: {
                text: 1,
                media: 1,
                views: 1,
                likeCount: 1,
                commentCount: 1,
                isLiked: 1,
                isBookmarked: 1,
                userDetails: 1,
                createdAt: 1,
                updatedAt: 1
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $skip: (Number(page) - 1) * Number(limit)
        },
        {
            $limit: Number(limit)
        }
    ])

    if (!allPosts) {
        throw new ApiErrors(400, "Failed to fetched the posts")
    }

    if (allPosts.length === 0) {
        return res.status(200).json(new ApiResponse(200, "no post available", []))
    }

    return res.status(200).json(new ApiResponse(200, "Posts fetched successfully", allPosts))


})


// fn for get following user post
const getFollowingUserPost = asyncHandler(async (req, res) => {

    const userId = req.user._id
    const { page = 1, limit = 20 } = req.query

    if (!userId) {
        throw new ApiErrors(400, "User id is required!")
    }

    if (!isValidObjectId(userId)) {
        throw new ApiErrors(400, "Invalid user Id!")
    }

    const posts = await Subscription.aggregate([

        {
            $match: {
                follower: new mongoose.Types.ObjectId(userId)
            }
        },

        {
            $lookup: {
                from: "posts",
                localField: "following",
                foreignField: "createdBy",
                as: "posts",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "createdBy",
                            foreignField: "_id",
                            as: "user",
                            pipeline: [
                                {
                                    $lookup: {
                                        from: "subscriptions",
                                        localField: "_id",
                                        foreignField: "follower",
                                        as: "followingDoc"
                                    },
                                },
                                {
                                    $lookup: {
                                        from: "subscriptions",
                                        localField: "_id",
                                        foreignField: "following",
                                        as: "followerDoc"
                                    },
                                }
                            ]
                        }
                    },
                    {
                        $unwind: "$user"
                    },
                    {
                        $addFields: {
                            userDetails: {
                                userId: "$user._id",
                                username: "$user.userName",
                                fullName: "$user.fullName",
                                profileImage: "$user.profileImage",
                                bio: "$user.bio",
                                follower: { $size: "$user.followerDoc" },
                                following: { $size: "$user.followingDoc" },
                                isFollowed: {
                                    $cond: {
                                        if: { $in: [req.user._id, "$user.followerDoc.follower"] },
                                        then: true,
                                        else: false
                                    }
                                }
                            }

                        }
                    },

                    {
                        $lookup: {
                            from: "likes",
                            localField: "_id",
                            foreignField: "post",
                            as: "likedDoc",
                        }
                    },

                    {
                        $lookup: {
                            from: "comments",
                            localField: "_id",
                            foreignField: "post",
                            as: "commentDoc"
                        }
                    },

                    {
                        $lookup: {
                            from: "bookmarks",
                            localField: "_id",
                            foreignField: "post",
                            as: "bookmarkedDoc"
                        }
                    },

                    {
                        $addFields: {
                            likeCount: { $size: "$likedDoc" },
                            isLiked: {
                                $cond: {
                                    if: { $in: [req.user._id, "$likedDoc.likedBy"] },
                                    then: true,
                                    else: false
                                }
                            },
                            commentCount: { $size: "$commentDoc" },
                            isBookmarked: {
                                $cond: {
                                    if: { $in: [req.user._id, "$bookmarkedDoc.bookmarkedBy"] },
                                    then: true,
                                    else: false
                                }
                            }
                        }
                    },

                    {
                        $project: {
                            text: 1,
                            media: 1,
                            views: 1,
                            likeCount: 1,
                            commentCount: 1,
                            isLiked: 1,
                            isBookmarked: 1,
                            userDetails: 1,
                            createdAt: 1,
                            updatedAt: 1
                        }
                    },

                ]
            }
        },

        {
            $unwind: "$posts"
        },

        {
            $project: {
                _id: "$posts._id",
                text: "$posts.text",
                media: "$posts.media",
                views: "$posts.views",
                likeCount: "$posts.likeCount",
                commentCount: "$posts.commentCount",
                isLiked: "$posts.isLiked",
                isBookmarked: "$posts.isBookmarked",
                userDetails: "$posts.userDetails",
                createdAt: "$posts.createdAt",
                updatedAt: "$posts.updatedAt",
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $skip: (Number(page) - 1) * Number(limit)
        },
        {
            $limit: Number(limit)
        }

    ])

    if (!posts) {
        throw new ApiErrors(400, "Failed to fetch Followers post!")
    }

    return res.status(200).json(new ApiResponse(200, "Following' user post fetched successfully ", posts))

})


// fn for delete post by id
const deletePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    if (!postId) {
        throw new ApiErrors(400, "Post ID is required!");
    }

    if (!isValidObjectId(postId)) {
        throw new ApiErrors(400, "Invalid ID!");
    }

    const post = await Post.findById(postId);

    if (!post) {
        throw new ApiErrors(404, "Post not found or unauthorized!");
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    
    try {
        if(!(post.createdBy.equals(req?.user?._id))){
            throw new ApiErrors(401, "Unauthorized request!")
        }
    
        await Like.deleteMany({post:post._id}).session(session)
        
        if(post.publicId){
            await deleteCloudinary(post.media.publicId, post.media.resourseType)
        }
    
        await Post.deleteOne({ _id: postId, createdBy: req.user._id }).session(session);
    
        await session.commitTransaction()
        
        return res.status(200).json(new ApiResponse(200, "Post deleted successfully.", {}));
    } catch (error) {
        await session.abortTransaction()
        throw new ApiErrors(error.status, error.message)
    }finally{
        session.endSession()
    }
});


export { createPost, updatePost, getPostById, getAllPost, getUserPost, getFollowingUserPost, deletePost }