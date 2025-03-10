import Team from "../models/team.model.js";
import Project from "../models/project.model.js";
import TeamMember from "../models/teamMember.model.js";

// Add Team Members to a Project
export const addMembers = async (req, res) => {
  try {
    const { projectId, members } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ success: false, message: "Project not found!" });

    let team = await Team.findOne({ project: projectId });
    if (!team) {
      team = new Team({ project: projectId, members });
    } else {
      team.members = [...new Set([...team.members, ...members])];
    }

    await team.save();
    res.status(200).json({ success: true, message: "Members added successfully!", team });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error adding members", error: error.message });
  }
};

// Get Team Members of a Project
export const getTeamMembers = async (req, res) => {
  try {
    const team = await Team.findOne({ project: req.params.projectId }).populate("members", "name email role");
    if (!team) return res.status(404).json({ success: false, message: "No team found for this project" });

    res.status(200).json({ success: true, team });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching team members", error: error.message });
  }
};

// Remove a Team Member
export const removeMember = async (req, res) => {
  try {
    const { projectId, memberId } = req.body;

    const team = await Team.findOne({ project: projectId });
    if (!team) return res.status(404).json({ success: false, message: "Team not found!" });

    team.members = team.members.filter((id) => id.toString() !== memberId);
    await team.save();

    res.status(200).json({ success: true, message: "Member removed successfully!", team });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error removing member", error: error.message });
  }
};

export const getAssignedMembers = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const team = await Team.findOne({ project: projectId }).populate("members", "name email");
    
    if (!team) {
      return res.status(200).json({ success: true, members: [] }); // Return empty if no members assigned
    }

    res.status(200).json({ success: true, members: team.members });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching assigned members", error: error.message });
  }
};

