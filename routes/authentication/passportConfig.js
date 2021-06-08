const passport = require("passport");
const LocalStatergy = require("passport-local").Strategy;
const User = require("../../models/User");
const bcrypt = require("bcryptjs");

const valueField = {
  usernameField: "phone",
};

const validateUser = async (phone, password, done) => {
  try {
    const user = await User.findOne({ phone: phone });
    console.log(`user:${user}`);
    if (!user) {
      return done(null, false, { message: "Invalid Credentials" });
    }
    const validatePassword = await bcrypt.compare(password, user.password);
    if (!validatePassword) {
      return done(null, false, { message: "Invalid Credentials" });
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
};

const initialize = () => {
  passport.use(new LocalStatergy(valueField, validateUser));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};

module.exports = initialize;
