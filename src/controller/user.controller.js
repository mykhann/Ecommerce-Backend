import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import bcrypt from "bcrypt"

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found");
    }
    const accessToken = await user.GenerateAccessToken();
    const refreshToken = await user.GenerateRefreshToken();
    console.table([refreshToken, accessToken])


    user.refreshToken = refreshToken;


    try {
      await user.save({ validateBeforeSave: false });
      console.log("User saved successfully");
    } catch (saveError) {
      console.error("Error while saving user:", saveError);
      throw new Error("User save failed");
    }

    return { refreshToken, accessToken };
  } catch (error) {
    console.log("Error while generating refresh  and access token");
  }
};

const SignUp = asyncHandler(async (req, res) => {
  
  const { name, email, password, username } = req.body;

  if (!name) {
    console.log("Please enter a name");
  }
  if (!email) {
    console.log("Please enter an email");
  }
  if (!password) {
    console.log("please enter a password");
  }
  if (!username) {
    console.log("Please enter a username");
  }

  const user = await User.findOne({ $or: [{ email }, { username }] });
  if (user) {
    console.log("user alread exists");
  }

  const avatarlocalPath = req.file ? req.file.path : null;
  if (!avatarlocalPath) {
    console.log("please enter avatarlocal path");
  }
  const avatar = await uploadOnCloudinary(avatarlocalPath);
  if (!avatar) {
    console.log("no avatar found");
  }

  const createdUser = await User.create({
    avatar: avatar.url,
    refreshToken: "",
    name,
    email,
    password,
    username,
  });
  res.json({ createdUser });
});

const Login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email) {
    return res.status(400).json({ message: "Please enter an email" });
  }
  if (!password) {
    return res.status(400).json({ message: "Please enter a password" });
  }

  // Check if email is registered
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "No account registered with this email" });
  }

  // Check if password is correct
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    return res.status(401).json({ message: "Incorrect password" });
  }

  // Generate access and refresh tokens
  const tokens = await generateAccessAndRefreshToken(user._id);
  const { accessToken, refreshToken } = tokens;

  // Set cookie options
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "strict",
  };

  // Send response with tokens and cookies
  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json({
      message: "Logged in successfully! Cookies sent.",
      accessToken,
      refreshToken,
    });
});


const Logout = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  )

  // clearing cookies 
  const options = {
    httpOnly: true,
    secure: true,
  }
  res.status(200).clearCookie("accessToken", options)
    .clearCookie("refreshToken", options).json({
      message: "Logged out successfully !! Cookies removed successfully"
    })

});

const UpdateAvatar = asyncHandler(async (req, res) => {
  const avatarlocalfilePath = req.file?.path;
  if (!avatarlocalfilePath) {
    throw new ApiError(202, "avatar local file path not found")
  }
  const avatar = await uploadOnCloudinary(avatarlocalfilePath);
  if (!avatar) {
    throw new ApiError(202, "Avatar not found")
  }
  // updating avatar 
  const user = await User.findByIdAndUpdate(req.user?._id, {
    $set: {
      avatar: avatar.url
    },

  },
    { new: true }
  )

  res.status(200).json({
    status: 200,
    data: user,
    message: "Account avatar updated successfully"
  });
});

const UpdatePassword = asyncHandler(async (req, res) => {
  const { oldpassword, newpassword } = req.body;
  if (!oldpassword || !newpassword) {
    throw new ApiError(201, "please enter the passwords");

  }
  const user = await User.findById(req.user?._id)
  if (!user) {
    throw new ApiError(202, "user not found");

  }
  const correctPass = await user.isPasswordCorrect(oldpassword);
  if (!correctPass) {
    throw new ApiError(202, "password incorrect");
  }
  const hashedNewPassword = await bcrypt.hash(newpassword, 10);
  const updatedUser = await User.findByIdAndUpdate(req.user?._id, {
    $set: {
      password: hashedNewPassword
    }
  }, { new: true })

  res.status(200).json({ message: "updated password successfully", updatedUser })

});
const UpdateEmail = asyncHandler(async (req, res) => {
  const { newEmail } = req.body;
  if (!newEmail) {
    throw new ApiError(201, "Please enter an email")
  }
  const user = await User.findByIdAndUpdate(req.user?._id, {
    $set: {
      email: newEmail
    }
  });
  if (!user) {
    throw new ApiError(201, "could not find an email")
  }
  res.status(200).json({ message: "email updated successfully", user })

});

const UpdateName = asyncHandler(async (req, res) => {
  const { newName } = req.body;
  if (!newName) {
    throw new ApiError(201, "please enter a name");
  }
  const user = await User.findByIdAndUpdate(req.user?._id,
    {
      $set: {
        name: newName
      }
    }
  )
  if (!user) {
    throw new ApiError(201, "couldn't find user");
  }
  res.status(200).json({ message: "name updated successfully", user })
})

const DeleteUser=asyncHandler(async(req,res)=>{
  const user= await User.findByIdAndDelete(req.user?._id)
  if(!user){
    throw new ApiError(201, "can't find user");
  }
  await user.deleteOne();
  res.status(200).json({ message:"user deleted successfully", user })
});

const GetUserInfo=asyncHandler(async(req,res)=>{
  const user= await User.findById(req.user?._id).select("-password -refreshToken")
  if (!user){
    throw new ApiError(201, "Login to see the user info");
  }
  res.status(200).json({ message:"User info successfully fetched",user}) 
  

})
export {
  SignUp,
  Login,
  Logout,
  UpdateAvatar,
  UpdatePassword,
  UpdateEmail,
  UpdateName,
  DeleteUser,
  GetUserInfo
};
