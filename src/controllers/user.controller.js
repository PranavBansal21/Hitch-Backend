const User = require("../models/user.models");
const {
    response_200,
    response_400,
    response_404,
    response_500,
} = require("../utils/responseCodes.utils");

exports.queryUser = async (req, res) => {
    try {
        const { email, username } = req.query;

        if (!email && !username) {
            return response_400(res, "Missing required fields");
        }

        const users = await User.find({
            $or: [
                { email: { $regex: email, $options: "i" } },
                { username: { $regex: username, $options: "i" } },
            ],
        }).exec();

        if (!users) {
            return response_404(res, "No user found");
        }

        const userList = users.map((user) => {
            return {
                username: user.username,
                email: user.email,
                name: user.name,
                profilePicUrl: user.profilePicUrl,
                id: user._id,
            };
        });

        return response_200(res, "User Found", userList);
    } catch (error) {
        return response_500(res, "Error querying user", error);
    }
}