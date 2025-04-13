import researchModel from "../../models/researchModel.js";


const deanResearchRetrieval = async (req, res) => {
    try {
        const researches = await researchModel.findAll();
        
    } catch (error) {
        
    }
}