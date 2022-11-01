const jwt = require("jsonwebtoken");
const User = require("./../Models/userModel");
const { JWT_SECRET } = require("./../Constants/index");

const requiresAuth = async (req, res, next) => {
    try {
        // check for authorization header
        if (req.headers.authorization) {
            // extract token from authorization header: 'Bearer token'
            const token = req.headers.authorization.split(" ")[1];

            // if no token is found return invalid response
            if (!token) return res.json({ error: "unauthorized" });

            // extract userId from token
            const { userId } = jwt.verify(token, JWT_SECRET);

            // check for user in db
            const user = await User.findById(userId);

            // if no user found return invalid response
            if (!user) return res.json({ error: "unauthorized" });

            // attack user property to all incoming requests
            req.user = newuser;
            next();
        } else {
            return res.json({ error: "unauthorized" });
        }
    } catch (error) {
        // on error return internal error
        console.log(error);
        return res.json({ internalError: error });
    }
};

module.exports = requiresAuth;
