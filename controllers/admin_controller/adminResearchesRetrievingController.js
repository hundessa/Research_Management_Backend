import researchModel from "../../models/researchModel.js";


const adminResearchesRetrievingController = async (req, res) => {
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

export default adminResearchesRetrievingController;