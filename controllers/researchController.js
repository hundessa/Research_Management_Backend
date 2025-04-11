import researchModel from "../models/researchModel";

const researchController = async (req, res) => {
  const { researchTitle, researchType, researchFile } = req.body;

  try {
    const newResearch = await researchModel.create({
      researchTitle,
      researchType,
      researchFile,
    });
  } catch (error) {
      console.log("Error during research uploading", error);
      res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default researchController;
