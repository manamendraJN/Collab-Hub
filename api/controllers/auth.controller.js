import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import jwt from "jsonwebtoken";

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
}

export const login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found!" });
      }
  
      const isMatch = bcryptjs.compareSync(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Invalid credentials!" });
      }
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  
      res.status(200).json({ success: true, token, user: { id: user._id, username: user.username, email: user.email } });
  
    } catch (error) {
      next(error);
    }
  };