import User from "../../models/userModel.js"



const coordinatorUserRetrivalController = async (req, res) => {
    try {
        const reviewerUser = await User.find({ role: "reviewer" });

        res.status(200).json(reviewerUser)

    } catch (error) {
        res.status(500).json({ message: "Server error: ", error });
    }
}


export default coordinatorUserRetrivalController;