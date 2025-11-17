import researchModel from "../../models/researchModel.js";


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