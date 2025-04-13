import researchModel from "../models/researchModel.js";

const researchController = async (req, res) => {
  const { researchTitle, researchType, researchFile, researcher } = req.body;

  try {
    const newResearch = await researchModel.create({
      researchTitle,
      researchType,
      researchFile,
      researcher,
    });
console.log(researcher);

    res.status(200).json({ message: 'File uploaded successfuly'})
  } catch (error) {
      console.log("Error during research uploading", error);
      res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default researchController;
