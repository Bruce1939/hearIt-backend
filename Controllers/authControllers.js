const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("./../Models/userModel");
const { JWT_SECRET } = require("./../Constants/index");

const signUpController = async (req, res) => {
    const { name, username, email, password } = req.body;

    try {
        // check for invalid request
        if (!name || !username || !email || !password)
            return res.json({ error: "invalid credentials" });

        // check credentials against db data
        const userExists = await User.findOne({ email });
        if (userExists) return res.json({ error: "user already exists" });

        // check if username is not taken
        const usernameTaken = await User.findOne({ username });
        if (usernameTaken) return res.json({ error: "Username is in use" });

        // hash password if user exists
        const hashedPassword = await bcrypt.hash(password, 10);

        // save user with hashed password
        const user = await User.create({
            name,
            username,
            email,
            password: hashedPassword,
        });

        // prepare json response: user
        const userToReturn = {
            id: user._id,
            name: user.name,
            username: user.username,
        };

        return res.json({ userDetails: userToReturn });
    } catch (error) {
        // on error return internal error
        console.log(error);
        return res.json({ internalError: error });
    }
};

const logInController = async (req, res) => {
    const { email, password } = req.body;

    try {
        // check for invalid request
        if (!email || !password)
            return res.json({ error: "invalid credentials" });

        // check credentials against db data
        const user = await User.findOne({ email });
        if (!user) return res.json({ error: "user doesn't exists" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.json({ error: "invalid credentials" });

        // on successful credential match generate tokens
        const payload = { userId: user._id };
        const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
        const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

        // prepare json response: user
        const userToReturn = {
            id: user._id,
            name: user.name,
            username: user.username,
        };

        // prepare json response: tokens
        const tokens = {
            accessToken,
            refreshToken,
        };

        return res.json({ tokens, userDetails: userToReturn });
    } catch (error) {
        // on error return internal error
        console.log(error);
        return res.json({ internalError: error });
    }
};

module.exports = {
    signUpController,
    logInController,
};
