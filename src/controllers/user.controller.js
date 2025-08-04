import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import {ApiError, ApiResponse} from "../utils/HandleApi.js";
import jwt from "jsonwebtoken";
import {uploadOnCloudinary} from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
    const {email, fullName, password, enrollmentNumber} = req.body;
    console.log(`email: ${email}, fullName: ${fullName}`);

    if ([fullName, email].some((field) => field?.trim() === "")){
        throw new ApiError(400, "All Fields are required")
    }

    const existingUser = await User.findOne({
        $or: [{email}, {enrollmentNumber}],
    });

    if (existedUser) {
        throw new ApiError(400,"User with this email or enrollment Number already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverLocalImagePath = req.files?.avatar[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        email,
        password,
        enrollmentNumber
    })

    const createdUser = await User.findById(user_id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while creating User");
    }

    return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User created Successfully"))


})