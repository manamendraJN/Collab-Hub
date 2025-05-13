import mongoose from "mongoose"; // Add this import
import User from "../models/user.model.js";

export const getUserDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await mongoose.model("User").find({}, "username email _id");
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};