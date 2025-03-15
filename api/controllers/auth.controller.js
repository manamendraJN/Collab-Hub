import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import jwt from "jsonwebtoken";
import teamMember from "../models/teamMember.model.js";

export const signup =async (req, res, next) => { 

    const {username,email,password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password,10);
    const newUser = new User({username,email,password:hashedPassword});
    try {
        await newUser.save(); 
        res.status(201).json("User created successfully");
    } catch (error) { 
       next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password, token } = req.body;
  
        // Check if token is provided for client login
        if (token) {
            const member = await teamMember.findOne({ email });
            if (!member) { // Change 'user' to 'member'
                return res.status(404).json({ success: false, message: "Member not found!" });
            }
  
            // Verify the token
            if (member.token !== token) {
                return res.status(401).json({ success: false, message: "Invalid token!" });
            }
  
            // If token is valid, return member details and token
            const clientToken = jwt.sign({ id: member._id }, process.env.JWT_SECRET, { expiresIn: "1d" }); // Change 'user._id' to 'member._id'
            return res.status(200).json({ success: true, token: clientToken, user: { id: member._id, email: member.email, token: member.token } }); // Change 'user' to 'member'
        }
  
        // Admin login using email and password
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }
  
        const isMatch = bcryptjs.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials!" });
        }
  
        const adminToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.status(200).json({ success: true, token: adminToken, user: { id: user._id, username: user.username, email: user.email } });
  
    } catch (error) {
        next(error);
    }
  };
  

