import { asyncHandler } from "../utils/asyncHandler.js";
import { User   } from "../models/user.model.js";
import {ApiError, ApiResponse} from "../utils/HandleApi.js";
import jwt from "jsonwebtoken";
import {uploadOnCloudinary} from "../utils/cloudinary.js";


const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { refreshToken, accessToken };
  } catch (error) {
    throw new ApiError(500, "Error generating tokens");
  }
};


const registerUser = asyncHandler(async (req, res) => {
    const {email, fullName, password, enrollmentNumber} = req.body;
    console.log(`email: ${email}, fullName: ${fullName}`);

    if ([fullName, email].some((field) => field?.trim() === "")){
        throw new ApiError(400, "All Fields are required")
    }

    const existingUser = await User.findOne({
        $or: [{email}, {enrollmentNumber}],
    });

    if (existingUser) {
        throw new ApiError(400,"User with this email or enrollment Number already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }
    
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    console.log(`avatar: ${avatar}`);

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        email,
        password,
        enrollmentNumber
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while creating User");
    }

    return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User created Successfully"))


})

const loginUser = asyncHandler(async (req, res) => {

    if (!req.body) {
        throw new ApiError(400, "Request body is missing");
    }

    const { email, enrollmentNumber , password } = req.body;

    console.log("request Body", req.body);

    if (!email && !enrollmentNumber) {
        throw new ApiError(400, "Email or Enrollment number is required");
    }

    if (!password) {
        throw new ApiError(400, "Password is required");;
    }

    const user = await User.findOne({
        $or: [{email}, {enrollmentNumber}]
    })

    if (!user) {
        throw new ApiError(400, "User Does not exist")
    }

    //authenticating the password by the user while logging in
    console.log("Password from request:", password);
    console.log("Hashed password from DB:", user.password);

    const isPasswordValid = await user.isPasswordCorrect(password);
    console.log("Password Validation Request", isPasswordValid);

    if(!isPasswordValid) {
        throw new ApiError(401, "password is invalid");
    }

    const {refreshToken, accessToken} = await generateAccessTokenAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,
                accessToken,
                refreshToken,
            },
            "User Logged In Successfully"
        )
    );

});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined,
            },
        },
        {
            new: true,
        }
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json( new ApiResponse( 200 , {} , "User Logged out successfully"));
});

export { registerUser, loginUser, logoutUser }