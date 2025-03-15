import TeamMember from "../models/teamMember.model.js";

// Create a Team Member
export const createTeamMember = async (req, res) => {
  try {
    const { name, email, role, token } = req.body; // Include token in the request body
    const existingMember = await TeamMember.findOne({ email });

    if (existingMember) {
      return res.status(400).json({ success: false, message: "Member already exists!" });
    }

    const newMember = new TeamMember({ name, email, role, token }); // Save token with the member
    await newMember.save();

    res.status(201).json({ success: true, message: "Team member created successfully!", teamMember: newMember });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating team member", error: error.message });
  }
};

// Get All Team Members
export const getTeamMembers = async (req, res) => {
  try {
    const teamMembers = await TeamMember.find();
    res.status(200).json({ success: true, teamMembers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching team members", error: error.message });
  }
};

// Delete a Team Member
export const deleteTeamMember = async (req, res) => {
  try {
    await TeamMember.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Team member deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting team member", error: error.message });
  }
};
