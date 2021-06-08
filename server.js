require("dotenv").config();
const connectDatabase = require("./connectDB");
const session = require("express-session");
const passport = require("passport");
const express = require("express");
const ROUTES = require("./constants/routes");
const app = express();
const passportConfig = require("./routes/authentication/passportConfig");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const cors = require("cors");
connectDatabase();
app.use(express.json());
app.use(cors());
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true,
  })
);
passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());
app.get("/", (req, res) => {
  res.send("welcome doctor");
});

app.use("/auth", ROUTES.AUTH);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`SERVICE RUNNING ON PORT ${PORT}`));
