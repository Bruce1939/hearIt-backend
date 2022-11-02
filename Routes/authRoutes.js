const express = require("express");
const router = express.Router();

const {
    signUpController,
    logInController,
    verifyAccount,
} = require("./../Controllers/authControllers");

router.post("/signup", signUpController);
router.post("/login", logInController);
router.get("/verify", verifyAccount);

module.exports = router;
