const express = require("express");
const doctorAuthRoute = express.Router();
const { register, upload, doctorImg } = require("./auth");

doctorAuthRoute.post(
  "/signup",
  upload.fields([
    { name: "registrationcertificates", maxCount: 10 },
    { name: "doctorimage", maxCount: 1 },
    { name: "logo", maxCount: 1 },
  ]),
  // doctorImg.single("doctorimage"),
  register
);

module.exports = doctorAuthRoute;
