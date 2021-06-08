const express = require("express");
const authRoute = express.Router();
const { registerValidation, loginValidation } = require("./validation");
const { register, login, refreshToken, verifyCheck } = require("./auth");

authRoute.post("/register", registerValidation, register);
authRoute.post("/login", loginValidation, login);
authRoute.post("/verify", verifyCheck);
authRoute.get("/token", refreshToken);

module.exports = authRoute;
