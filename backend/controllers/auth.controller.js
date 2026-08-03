import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";
import { OAuth2Client } from "google-auth-library";

import { generateToken } from "../utils/generateToken.js";
import { sendEmail } from "../utils/sendEmail.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const MAX_LOGIN_ATTEMPTS = parseInt(process.env.MAX_LOGIN_ATTEMPTS || "5");
const LOCK_TIME = parseInt(process.env.LOCK_TIME || "900000");

// PATH     : /api/auth/signup
// METHOD   : POST
// ACCESS   : PUBLIC
// DESC     : Create User
export const signup = async (req, res) => {
  try {
    const { fullName, email, password, mobile } = req.body;

    // Validate required fields
    if (!fullName || !email || !password || !mobile) {
      return res
        .status(400)
        .json({ error: "All required fields must be filled" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check if email or mobile already exists
    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
    if (existingUser) {
      return res.status(400).json({
        error:
          existingUser.email === email
            ? "Email is already taken"
            : "Phone Number is already taken",
      });
    }

    // Validate password length
    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters long" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      fullName,
      email,
      mobile,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate token and set cookie
    generateToken(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      mobile: newUser.mobile,
    });
  } catch (error) {
    console.error("Error in signup controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// PATH     : /api/auth/login
// METHOD   : POST
// ACCESS   : PUBLIC
// DESC     : Login a User
export const userLogin = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email and Password are required" });

    const user = await User.findOne({ email }).select("+password");

    if (!user)
      return res.status(400).json({ error: "Invalid email or password" });

    //  Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 60000);

      return res.status(403).json({
        error: `Account is locked. Try again in ${remainingTime} minute(s).`,
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      user.loginAttempts = (user.loginAttempts || 0) + 1;

      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + LOCK_TIME);
      }

      await user.save();
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Reset login attempts and unlock if password is correct
    user.loginAttempts = 0;
    user.lockUntil = undefined;

    await user.save();

    generateToken(user._id, res, rememberMe);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      mobile: user.mobile,
    });
  } catch (error) {
    console.error("Error in login controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// PATH     : /api/auth/logout
// METHOD   : POST
// ACCESS   : PUBLIC
// DESC     : Logout a User
export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "User Logout successful" });
  } catch (error) {
    console.log("Error in user logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// PATH     : /api/auth/me
// METHOD   : POST
// ACCESS   : PRIVATE
// DESC     : Check User authenticated
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUser controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// PATH     : /api/user/update/profile"
// METHOD   : POST
// ACCESS   : PUBLIC
// DESC     : update User
export const updateProfile = async (req, res) => {
  try {
    const { fullName, mobile, currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select(
      "-role -cart +password",
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (currentPassword && newPassword) {
      if (user.password) {
        const isPasswordMatched = await bcrypt.compare(
          currentPassword,
          user.password,
        );

        if (!isPasswordMatched) {
          return res
            .status(400)
            .json({ error: "Current password is incorrect" });
        }
      }

      if (newPassword.length < 8) {
        return res.status(400).json({
          error: "New password must be at least 8 characters long",
        });
      }

      // Update password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    } else if (currentPassword || newPassword) {
      return res.status(400).json({
        error:
          "Both current password and new password must be provided to change the password",
      });
    }

    if (fullName) user.fullName = fullName;
    if (mobile) user.mobile = mobile;

    // Handle profile image upload
    if (req.files && req.files.profileImg) {
      if (user.profileImg && user.profileImg.public_id) {
        await cloudinary.uploader.destroy(user.profileImg.public_id);
      }

      // Upload new profile image to Cloudinary
      const profileImgResponse = await cloudinary.uploader.upload(
        req.files.profileImg.tempFilePath,
        { folder: "PROFILE_IMAGES" },
      );

      user.profileImg = {
        public_id: profileImgResponse.public_id,
        url: profileImgResponse.secure_url,
      };
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error in updateProfile:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PATH     : /api/auth/forgot-password
// METHOD   : POST
// ACCESS   : PUBLIC
// DESC     : Forgot Password Token
export const forgotPassword = async (req, res) => {
  const { email, type } = req.body;

  // Validate input
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  const baseUrl =
    type === "dashboard"
      ? process.env.DASHBOARD_URL || process.env.FRONTEND_URL
      : process.env.FRONTEND_URL;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate and save password reset token
    const token = await user.createPasswordResetToken();
    await user.save();

    const resetURL = `
  <html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #4CAF50;">Password Reset Request</h2>
      <p>Hi ${user.fullName},</p>
      <p>Please click the button below to reset your password. This link will expire in 10 minutes:</p>
      <p>
        <a href="${baseUrl}/reset-password/${token}" 
           style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 4px;">Reset Password</a>
      </p>
      <p>If you did not request this, please ignore this email.</p>
      <p>Thank you,<br>Your Team</p>
    </div>
  </body>
  </html>
`;

    const emailData = {
      to: email,
      subject: "GalaxyDials Password Reset Request",
      text: `Hi ${user.fullName}, please follow this link to reset your password.`,
      html: resetURL,
    };

    await sendEmail(emailData);

    res.status(200).json({
      success: true,
      message: `Password reset email sent to ${user.email}. Check your inbox.`,
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/auth/reset-password/token
// METHOD   : POST
// ACCESS   : PUBLIC
// DESC     : Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (newPassword.length < 8) {
      return res.status(400).json({
        error: "New password must be at least 8 characters long.",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: "Token expired or invalid, please try again." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Password reset successful. You can now log in with your new password.",
      user,
    });
  } catch (error) {
    console.error("Error in resetPassword:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/auth/google
// METHOD   : POST
// ACCESS   : PUBLIC
// DESC     : Google OAuth Login/Signup
export const googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: "Google ID token is required" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ email }).select("+password");

    if (user) {
      if (user.loginProvider !== "google") {
        user.loginProvider = "google";
        user.profileImg = user.profileImg?.url
          ? user.profileImg
          : picture
            ? { url: picture }
            : user.profileImg;
        await user.save();
      }
    } else {
      user = await User.create({
        fullName: name,
        email,
        loginProvider: "google",
        profileImg: picture ? { url: picture } : undefined,
      });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      mobile: user.mobile,
      profileImg: user.profileImg,
    });
  } catch (error) {
    console.error("Error in googleAuth controller:", error.message);
    res.status(500).json({ error: "Google authentication failed" });
  }
};
