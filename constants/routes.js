const authRoute = require("../routes/authentication");
const doctorAuthRoute = require("../routes/doctors/index");

const ROUTES = {
  AUTH: authRoute,
  DOCTORAUTH: doctorAuthRoute,
};

module.exports = ROUTES;
