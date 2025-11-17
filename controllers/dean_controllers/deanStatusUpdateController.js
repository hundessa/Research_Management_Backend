import Notification from "../../models/notificationModel.js";
import researchModel from "../../models/researchModel.js";


const deanStatusUpdateController = async (req, res) => {
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
    
export default deanStatusUpdateController;