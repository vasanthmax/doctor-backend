const jwt = require("jsonwebtoken");

const generateToken = (_id, tokenType = "A") => {
  const TOKEN_TYPE = tokenType == "R" ? "REFRESH_TOKEN" : "ACCESS_TOKEN";

  const ACCESS_TOKEN_EXPIRY = "1h";

  const payload = {
    id: _id,
    type: TOKEN_TYPE,
  };
  if (tokenType == "R") {
    const signedJWT = jwt.sign(payload, process.env.AUTHORIZATION_SECRET_KEY);
    return signedJWT;
  }
  const signedJWT = jwt.sign(payload, process.env.AUTHORIZATION_SECRET_KEY, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
  return signedJWT;
};

const generateAccessToken = (object_id) => {
  const tokenType = "A";
  return generateToken(object_id, tokenType);
};

const generateRefreshToken = (object_id) => {
  const tokenType = "R";
  return generateToken(object_id, tokenType);
};

module.exports = { generateAccessToken, generateRefreshToken };
