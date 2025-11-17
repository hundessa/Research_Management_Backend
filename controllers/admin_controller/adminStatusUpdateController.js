import researchModel from "../../models/researchModel.js";
import Notification from "../../models/notificationModel.js"; // make sure the path is correct

const adminStatusUpdateController = async (req, res) => {
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

export default adminStatusUpdateController;
