import ApiErrors from "../utils/ApiErrors.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import { uploadCloudinary, deleteCloudinary } from "../utils/cloudinary.js";
import conf from "../conf/conf.js";
import jwt from "jsonwebtoken";

const options = {
    httpOnly: true,
    secure: true,
    // samesite: "none", // just in case cookie not working properly
}

const generateAccessAndRefreshToken = async function (id) {
    // Generate access token
    const user = await User.findById(id);
    if (!user) {
        throw new ApiErrors(404, "User not found, please re-check user details");
    }
    const accessToken = await user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()
    if (!accessToken || !refreshToken) {
        throw new ApiErrors(500, "Failed to generate access and refresh tokens");
    }
    // Save refresh token in the database
    user.refreshToken = refreshToken;

    // disable all validation when accessing db document
    await user.save({
        validateBeforeSave: false
    });
    // console.log("Access token generated", accessToken, refreshToken);

    return {
        accessToken,
        refreshToken
    }
}

const createUser = asyncHandler(async (req, res) => {
    const { userName, fullName, email, password, bio, link } = req.body;

    if (!userName || !fullName || !email || !password) {
        throw new ApiErrors(400, "Please provide all required fields");
    }

    //  check user email exist or not
    const existUser = await User.findOne({
        $or: [
            { userName },
            { email }
        ]
    })
    if (existUser) {
        const field = existUser.email === email ? "Email" : "Username";
        throw new ApiErrors(400, `${field} already exists`);
    }

    //  req.files have all files that are provide by user
    const coverImageFile = req.files?.coverImage?.[0]?.path
    const profileImageFile = req.files?.profileImage?.[0]?.path

    // console.log("cover", req.files.coverImage[0].path);
    // console.log("profile", req.files.profileImage[0].path);

    if (!coverImageFile) {
        throw new ApiErrors(400, "Cover image is required")
    }
    if (!profileImageFile) {
        throw new ApiErrors(400, "Profile image is required")
    }

    const [uploadCoverImageToCloudinary, uploadProfileImageToCloudinary] = await Promise.all([
        uploadCloudinary(coverImageFile),
        uploadCloudinary(profileImageFile)]
    )


    //  creating new db document
    const user = await User.create({
        userName,
        fullName,
        email,
        coverImage: {
            url: uploadCoverImageToCloudinary?.secure_url || "",
            publicId: uploadCoverImageToCloudinary?.public_id || "",

        },
        profileImage: {
            url: uploadProfileImageToCloudinary?.secure_url || "",
            publicId: uploadProfileImageToCloudinary?.public_id || "",
        },
        password,
        bio,
        link

    });

    const createdUser = await User.findById(user.id).select(" -password -refreshToken")


    if (!createdUser) throw new ApiErrors(400, "User creation failed")
    return res.status(201).json(new ApiResponse(201, "user created successfully", createdUser))


})

const loginuser = asyncHandler(async (req, res) => {
    const { userName, email, password } = req.body;

    if (!userName && !email) {
        throw new ApiErrors(400, "Please provide username or email ");
    }
    if (!password) {
        throw new ApiErrors(400, "Please provide password ");
    }
    //  check user credentials
    const checkUser = await User.findOne({
        $or: [
            { userName },
            { email },
        ]
    });
    if (!checkUser) {
        throw new ApiErrors(404, "no user exist with this creditionals")
    }
    // check password
    const passwordValid = await checkUser.comparePassword(password)

    if (!passwordValid) {
        throw new ApiErrors(401, "Invalid credentials")
    }

    // genrating access and refresh tokens
    const {
        accessToken,
        refreshToken,
    } = await generateAccessAndRefreshToken(checkUser?._id)

    const loggedIn = await User.findById(checkUser.id).select(" -password -refreshToken")

    if (!loggedIn) throw new ApiErrors(500, "Failed to login due internal error")
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, "User logged in successfully", { accessToken, refreshToken, loggedIn }))

})

const logoutUser = asyncHandler(async (req, res) => {
    // req.user have all details about current user
    const { id } = req.user
    // console.log("id: ", id);
    await User.findByIdAndUpdate(id, {
        // dont unset refresh token as undefined, it treat as string.
        $unset: { refreshToken: "", }
    },
        {
            new: true,
            runValidators: true,
        }
    )
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, "User logged out successfully", {


        }))

})

const jwtRefreshToken = asyncHandler(async (req, res) => {
    const oldRefreshToken = req.cookies?.refreshToken
    // console.log("Refresh token", oldRefreshToken);
    if (!oldRefreshToken) {
        throw new ApiErrors(401, "Refresh token required, please re-login")
    }

    // Verify refresh token and get user details from database.
    try {
        const decode = jwt.verify(
            oldRefreshToken,
            conf.refreshSecretToken
        )

        const user = await User.findById(decode?.id)
        if (!user) {
            throw new ApiErrors(404, "invaild tokens, please re-check or re-login");
        }
        if (oldRefreshToken !== user.refreshToken) {
            throw new ApiErrors(401, "Refresh token not match, please re-login");
        }
        // genrating access and refresh tokens
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user.id)
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, "User token refreshed successfully", { accessToken, refreshToken }))
    } catch (error) {
        console.error("Error refreshing token:", error);
        throw new ApiErrors(500, "Failed to refresh tokens, please try again later")

    }
})

const currentUser = asyncHandler(async (req, res) => {
    // req.user have all details about current user
    const userId = req.user.id;

    const user = await User.findById(userId).select(" -password -refreshToken")
    if (!user) throw new ApiErrors(404, "User not found , please login again")
    return res.
        status(200).json(new ApiResponse(200, "User details", user))

})

const updateUserAccountDetails = asyncHandler(async (req, res) => {
    const { id } = req.user
    const { userName, fullName, email, bio, link } = req.body;
    //  validate parameters
    if (!userName && !fullName && !email && !bio && !link) {
        throw new ApiErrors(400, "Not find any information for updating user profie");
    }

    const currentUser = await User.findById(id).select("-password -refreshToken")
    if (!currentUser) throw new ApiErrors(404, "User not found, please login again");

    // update user details
    currentUser.userName = userName || currentUser.userName;
    currentUser.fullName = fullName || "";
    currentUser.email = email || currentUser.email;
    currentUser.bio = bio || "";
    currentUser.link = link || "";
    await currentUser.save()
    return res.status(200).json(new ApiResponse(200, "User details updated successfully", currentUser))
})

const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverImage = req.file?.path
    const public_id = req.user.coverImage.publicId


    if (!coverImage) {
        throw new ApiErrors(400, "coverImage image is required");
    }
    const uploadProfileImageToCloudinary = await uploadCloudinary(coverImage)
    if (uploadProfileImageToCloudinary) {
        deleteCloudinary(public_id)
    }
    // update user profile image
    const updatedCoverImage = await User.findByIdAndUpdate(req.user.id, {
        coverImage: {
            url: uploadProfileImageToCloudinary?.secure_url || "",
            publicId: uploadProfileImageToCloudinary?.public_id || "",
        }
    },
        {
            new: true,
            runValidators: false,
        }
    )
    return res.status(200).json(new ApiResponse(200, "Profile image updated successfully", updatedCoverImage))
})

const updateUserProfileImage = asyncHandler(async (req, res) => {
    const profileImage = req.file?.path
    const public_id = req.user.profileImage?.publicId


    if (!profileImage) {
        throw new ApiErrors(400, "Profile image is required");
    }
    const uploadProfileImageToCloudinary = await uploadCloudinary(profileImage)

    // delete profile image when new one uplaoded
    if (uploadProfileImageToCloudinary) {
        deleteCloudinary(public_id)
    }
    // update user profile image
    const updatedProfileImage = await User.findByIdAndUpdate(req.user.id, {
        profileImage: {
            url: uploadProfileImageToCloudinary?.secure_url || "",
            publicId: uploadProfileImageToCloudinary?.public_id || "",
        }
    },
        {
            new: true,
            runValidators: true,
        }
    )
    return res.status(200).json(new ApiResponse(200, "Profile image updated successfully", updatedProfileImage))
})

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.user

    const user = await User.findById(id)
    if (!user) throw new ApiErrors(404, "User not found,please login again");

    // delete profile image from cloudinary
    if (user.profileImage?.publicId) await deleteCloudinary(user.profileImage.publicId);
    if (user.coverImage?.publicId) await deleteCloudinary(user.coverImage.publicId);

    // delete user from database

    await user.deleteOne()

    // clear cookies
    res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)

    return res.status(200).json(new ApiResponse(200, "User deleted successfully", user))

})

const search = asyncHandler(async (req, res) => {
    const { queries } = req.params

    const query = await User.aggregate([
        {
            $match: {
                userName: {
                    $regex: queries,
                    $options: "i"
                }
            }
        },
        {
            $project: {
                _id: 1,
                userName: 1,
            }
        }
    ])
    if (query.length===0) res.status(400).json(new ApiResponse(
        400, "user match not found"
    ))

    return res.status(200).json(new ApiResponse(200, "query fetched  successfully", query))
})

// make api endpoint for user profile followr, following etc...
export {
    createUser,
    loginuser,
    logoutUser,
    jwtRefreshToken,
    currentUser,
    updateUserProfileImage,
    updateUserCoverImage,
    updateUserAccountDetails,
    deleteUser,
    search
};

