import researchModel from "../models/researchModel.js";
import Notification from "../models/notificationModel.js";


export const deanResearchRetrievalController = async (req, res) => {
   try {
     const acceptedResearches = await researchModel.find({
       status: "accepted",
     });
     res.json(acceptedResearches);
   } catch (err) {
     res.status(500).json({ message: "Failed to fetch accepted research" });
   }
}


export const DeanGetResearchById = async (req, res) => {
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


export const deanResearchStatusUpdateController = async (req, res) => {
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
        if (status === "pending") {
          const notification = new Notification({
            message: `Research titled "${updatedResearch.researchTitle}" has been accepted.`,
            recipientRole: "coordinator",
          });
    
          await notification.save();
        }
    
        res.json(updatedResearch);
      } catch (err) {
        console.error("Status update error:", err);
        res.status(500).json({ message: "Error updating research status" });
      }
};



export const getDeanNotificationController = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipientRole: "dean",
    }).sort({ timestamp: -1 });
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};


export const createDeanNotification = async (req, res) => {
  try {
    const { message, to } = req.body;

    const notification = new Notification({
      message,
      recipientRole: to || "coordinator", // or whoever it’s for
    });

    await notification.save();

    res.status(201).json({ message: "Notification sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create notification" });
  }
};