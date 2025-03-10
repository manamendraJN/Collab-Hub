import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "TeamMember" }], 
}, { timestamps: true });

const Team = mongoose.model("Team", teamSchema);
export default Team;
