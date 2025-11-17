import User from "../../models/userModel.js"


const adminUserRetrievalController = async (req, res) => {
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


export default adminUserRetrievalController;