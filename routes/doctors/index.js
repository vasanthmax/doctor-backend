const express = require("express");
const doctorAuthRoute = express.Router();
const { register, upload } = require("./auth");

doctorAuthRoute.post(
  "/signup",
  upload.array("registrationcertificates", 10),
  register
);

module.exports = doctorAuthRoute;
