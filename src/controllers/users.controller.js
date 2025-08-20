import jwt from "jsonwebtoken";

const registerUser = async(req, res) => {
    return res.sendSuccess("successfully registered");
}

const loginUser = async(req, res) => {
    if (req.user) {
        const sessionUser = {
            role: req.user.role,
            id: req.user._id
        }
        try {
            const token = jwt.sign(sessionUser, process.env.JWT_SECRET, { expiresIn: "10d" });
            res.cookie(process.env.JWT_COOKIE, token);
        } catch (error) {
            return res.sendBadRequest("Server error");
        }
        return res.sendPayload(null,req.user)
    }
}
const current = async(req, res) => {
    if (req.user) {
        res.sendPayload(req.user);
    } else {
        res.sendUnauthorized("need to log in first");
    }
}
export default {
    current,
    loginUser,
    registerUser
}