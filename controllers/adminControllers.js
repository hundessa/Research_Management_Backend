import User from "../models/userModel.js"
import researchModel from "../models/researchModel.js";
import Notification from "../models/notificationModel.js";


export const adminUserRetrievalController = async (req, res) => {
    try {
        const Users = await User.find();
        const UsersDetail = Users.map((user) => ({
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            role: user.role,
            status: user.status,
        }));

        res.status(200).json(UsersDetail)
    } catch (error) {
        res.status(500).json({ message: "Server error: ", error });
    }
}

export const adminResearchesRetrievingController = async (req, res) => {
     try {
    const researches = await researchModel
      .find()
      .populate("researcher", "firstname email");
    const researchesDetails = researches.map((research) => ({
      _id: research._id,
      researchTitle: research.researchTitle,
      researchType: research.researchType,
      researchFile: research.researchFile,
      status: research.status,
      date: research.createdAt,
      researcherName: research.researcher?.firstname || "Unknown",
      researcherEmail: research.researcher?.email || "Unknown",
    }));
    // console.log('researches:', researchesDetails); // Log the researches
    res.status(200).json(researchesDetails);
  } catch (err) {
    console.log("error: ", err);
    res.status(500).json({ message: "Server error" });
  }
}

export const getResearchById = async (req, res) => {
  const { id } = req.params;
  try {
    const research = await researchModel.findById(id);
    if (!research) {
      return res.status(404).json({ message: "Research not found" });
    }
    res.status(200).json(research);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const adminResearchStatusUpdateController = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedResearch = await researchModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedResearch) {
      return res.status(404).json({ message: "Research not found" });
    }

    // Send notification to dean if status is accepted
    if (status === "accepted") {
      const notification = new Notification({
        message: `Research titled "${updatedResearch.researchTitle}" has been accepted.`,
        recipientRole: "dean",
      });

      await notification.save();
    }

    res.json(updatedResearch);
  } catch (err) {
    console.error("Status update error:", err);
    res.status(500).json({ message: "Error updating research status" });
  }
};


export const getAdminNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipientRole: "admin",
    }).sort({ timestamp: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



export const sendAdminNotification = (req, res) => {
  const { to, message, researchId, researcher, title, type, file } = req.body;

  // Here, you can either save this to a DB or just log it for now
  console.log("New Notification to Dean:", {
    to,
    message,
    researchId,
    researcher,
    title,
    type,
    file,
  });

  // Temporary response
  res.status(201).json({ message: "Notification sent successfully" });
};