import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  role: { type: String, required: true },
  token: { type: String } // Add token field
}, { timestamps: true });

const TeamMember = mongoose.model("TeamMember", teamMemberSchema);
export default TeamMember;
