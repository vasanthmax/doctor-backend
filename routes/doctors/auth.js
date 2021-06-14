const bcrypt = require("bcryptjs");
const Doctor = require("../../models/Doctor");
const path = require("path");
const STATUS_CODES = require("../../constants/statusCodes");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../authentication/controller");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

const register = async (req, res) => {
  const registeredUser = await Doctor.findOne({
    registerno: req.body.registerno,
  });
  if (registeredUser)
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      message: "Doctor Already exists",
    });
  console.log(req.files);
  var paths = req.files.map((file) => file.path);
  const newDoctor = new Doctor({
    username: req.body.username,
    dob: req.body.dob,
    gender: req.body.gender,
    city: req.body.city,
    state: req.body.state,
    clinicaddress: req.body.clinicaddress,
    phone: parseInt(req.body.phone),
    email: req.body.email,
    degree: req.body.degree,
    speciality: req.body.speciality,
    summary: req.body.summary,
    registerno: req.body.registerno,
    registrationcouncil: req.body.registrationcouncil,
    registrationcertificates: paths,
    logo: "l",
    doctorimage: "doctorimage",
    consulationfee: req.body.consulationfee,
    languages: req.body.languages,
    accountnumber: req.body.accountnumber,
    bankname: req.body.bankname,
    branchname: req.body.branchname,
    ifsccode: req.body.ifsccode,
    password: req.body.password,
  });
  console.log(newDoctor.password);
  const salt = await bcrypt.genSalt(10);
  newDoctor.password = await bcrypt.hash(newDoctor.password, salt);
  const refreshToken = generateRefreshToken(newDoctor._id);
  newDoctor.refreshToken = refreshToken;
  try {
    await newDoctor.save();
    const accessToken = generateAccessToken(newDoctor._id);
    console.log("registered");
    return res.status(STATUS_CODES.CREATED).json({
      _id: newDoctor._id,
      accessToken: accessToken,
      refreshToken: newDoctor.refreshToken,
    });
  } catch (e) {
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: "Server error",
    });
  }
};

module.exports = { upload, register };
