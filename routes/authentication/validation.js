const Joi = require("joi");
const STATUS_CODES = require("../../constants/statusCodes");
const registerValidation = (req, res, next) => {
  const registerFilter = Joi.object({
    username: Joi.string().required().min(3),
    password: Joi.string().min(6).required(),
    age: Joi.number().required(),
    DOB: Joi.date().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    phone: Joi.number().required(),
    email: Joi.string().email().required(),
  });

  const { error, value } = registerFilter.validate(req.body);
  if (error)
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      message: error.details[0].message,
    });

  req.body = value;
  next();
};

const loginValidation = (req, res, next) => {
  const loginFilter = Joi.object({
    phone: Joi.number().required(),
    password: Joi.string().min(6).required(),
  });

  const { error, value } = loginFilter.validate(req.body);
  if (error)
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      message: error.details[0].message,
    });

  req.body = value;
  next();
};

module.exports = { registerValidation, loginValidation };
