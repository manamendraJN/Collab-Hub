// authMiddleware.js
import jwt from "jsonwebtoken";
import TeamMember from "../models/teamMember.model.js";
import User from "../models/user.model.js";

export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized access!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };

    // Determine user type
    const user = await User.findById(decoded.id);
    if (user) {
      req.user.type = "admin";
    } else {
      const member = await TeamMember.findById(decoded.id);
      if (member) {
        req.user.type = "client";
      } else {
        return res.status(403).json({ success: false, message: "Invalid user!" });
      }
    }

    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: "Invalid token!" });
  }
};