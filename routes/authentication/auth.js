const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const STATUS_CODES = require("../../constants/statusCodes");
const { generateAccessToken, generateRefreshToken } = require("./controller");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
let verify;

let newUser;
const register = async (req, res) => {
  const registeredUser = await User.findOne({ phone: req.body.phone });
  if (registeredUser)
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      message: "User Already exists",
    });
  newUser = new User({
    username: req.body.username,
    age: req.body.age,
    DOB: req.body.DOB,
    city: req.body.city,
    state: req.body.state,
    phone: req.body.phone,
    password: req.body.password,
    email: req.body.email,
  });
  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(newUser.password, salt);
  const refreshToken = generateRefreshToken(newUser._id);
  newUser.refreshToken = refreshToken;
  client.verify.services
    .create({ friendlyName: "My First Verify Service" })
    .then((service) =>
      client.verify
        .services(service.sid)
        .verifications.create({ to: `+91${req.body.phone}`, channel: "sms" })
        .then((verification) => {
          verify = verification.serviceSid;

          res.json(verification.status);
        })
        .then(() => {
          console.log(verify);
        })
    );
};
const verifyCheck = (req, res) => {
  client.verify
    .services(verify)
    .verificationChecks.create({
      to: `+91${newUser.phone}`,
      code: req.body.otp,
    })
    .then(async (verification_check) => {
      if (verification_check.status === "approved") {
        try {
          await newUser.save();
          const accessToken = generateAccessToken(newUser._id);
          console.log("registered");
          return res.status(STATUS_CODES.CREATED).json({
            _id: newUser._id,
            accessToken: accessToken,
            refreshToken: newUser.refreshToken,
          });
        } catch (e) {
          return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: "Server error",
          });
        }
      } else {
        res.send("try again");
      }
    });
};

const login = async (req, res, next) => {
  passport.authenticate(
    "local",
    (err, user, info) => {
      if (err) {
        res.sendStatus(
          STATUS_CODES.INTERNAL_SERVER_ERROR,
          "Internal Server Error"
        );
      }
      if (!user && info) {
        return res.status(STATUS_CODES.UNAUTHORIZED).send(info);
      }

      req.logIn(user, async (error) => {
        if (error) {
          return next(error);
        }
        const accessToken = generateAccessToken(user._id);
        try {
          await user.save();
          return res.status(STATUS_CODES.OK).json({
            _id: user._id,
            accessToken: accessToken,
            refreshToken: user.refreshToken,
          });
        } catch (e) {
          return res.send("ERROR");
        }
      });
    },
    {
      successRedirect: "/",
    }
  )(req, res, next);
};
const refreshToken = async (req, res) => {
  const bearerToken = req.headers["authorization"];
  if (!bearerToken)
    return res.status(STATUS_CODES.FORBIDDEN).send("Access Denied");

  const refreshToken = bearerToken.split(" ")[1];
  jwt.verify(
    refreshToken,
    process.env.AUTHORIZATION_SECRET_KEY,
    (err, payload) => {
      if (err) return res.status(STATUS_CODES.FORBIDDEN).json(err);

      if (payload.type != "REFRESH_TOKEN")
        return res.status(STATUS_CODES.FORBIDDEN).json({
          status: "Error",
          error: {
            name: "InvalidTokenError",
            message: "Not a refresh token.",
          },
        });
      User.findById(payload.id, (err, user) => {
        if (err)
          return res.status(STATUS_CODES.NOT_FOUND).send("user not found");
        if (user && user.refreshToken == refreshToken) {
          const newAccessToken = generateAccessToken(payload.id);
          return res.json({
            status: "Success",
            accessToken: newAccessToken,
          });
        }
        return res.status(STATUS_CODES.FORBIDDEN).json({
          status: "Error",
          error: {
            name: "InvalidTokenError",
            message: "Wrong token.",
          },
        });
      });
    }
  );
};

module.exports = { register, login, refreshToken, verifyCheck };
