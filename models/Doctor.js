const mongoose = require("mongoose");

const DoctorSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    clinicaddress: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    degree: {
      type: String,
      required: true,
    },
    speciality: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    registerno: {
      type: String,
      required: true,
    },
    registrationcouncil: {
      type: String,
      required: true,
    },
    registrationcertificates: {
      type: Array,
      required: true,
    },
    consulationfee: {
      type: String,
      required: true,
    },
    languages: {
      type: Array,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
    doctorimage: {
      type: String,
      required: true,
    },
    accountnumber: {
      type: String,
      required: true,
    },
    bankname: {
      type: String,
      required: true,
    },
    branchname: {
      type: String,
      required: true,
    },
    ifsccode: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

const Doctor = mongoose.model("Doctor", DoctorSchema);

module.exports = Doctor;
