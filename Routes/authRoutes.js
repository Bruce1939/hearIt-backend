const express = require("express");
const router = express.Router();

const {
    signUpController,
    logInController,
} = require("./../Controllers/authControllers");

router.post("/signup", signUpController);
router.post("/login", logInController);

module.exports = router;
