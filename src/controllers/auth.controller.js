import Joi from "joi";
import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { appConfig, error } from "../consts.js";

const register = async (req, res) => {
  // 1. validation
  const validData = await Joi.object({
    name: Joi.string().trim().min(3).max(50).required(),
    surname: Joi.string().trim().min(3).max(50).required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().min(6).max(16).required(),
  })
    .validateAsync(req.body, { abortEarly: false })
    .catch((err) => {
      console.log("err", err);
      const errorList = err.details.map((item) => item.message);
      return res.status(422).json({
        message: "Validasiya xetasi bash verdi!",
        error: errorList,
      });
    });

  const existsUser = await User.findOne({
    email: validData.email,
  });
  if (existsUser) {
    return res.json({
      message: `${validData.email} - sistemde movcuddur!`,
    });
  }

  // 2. hash password
  validData.password = await bcrypt.hash(validData.password, 10);

  // 3. complete register
  const newUser = await User.create(validData);
  res.status(201).json(newUser);
};

const login = async (req, res) => {
  // 1. validate
  const validData = await Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().min(6).max(16).required(),
  })
    .validateAsync(req.body, { abortEarly: false })
    .catch((err) => {
      return res.status(422).json({
        message: "Xeta bash verdi!",
        error: err.details.map((item) => item.message),
      });
    });

  // 2. find user
  const user = await User.findOne({
    email: validData.email,
  });
  if (!user)
    return res.status(401).json({ message: "Email ve ya shifre sehvdir!" });

  // 3. Check password
  const isValidPassword = await bcrypt.compare(
    validData.password,
    user.password
  );
  if (!isValidPassword) {
    return res.status(401).json({
      message: "Email ve ya shifre sehvdir!",
    });
  }

  const jwt_payload = {
    sub: user._id,
  };

  // 4. create jwt_token
  const new_token = jwt.sign(jwt_payload, appConfig.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "1d",
  });

  res.json({
    access_token: new_token,
  });
};
const resetPass = async (req, res) => {
  const user = req.user;

  try {
    const existUser = await User.findById(user._id);
    if (!existUser) {
      return res.status(404).json({
        message: error[404],
      });
    }

    const validData = await Joi.object({
      password: Joi.string().min(6).trim().required(),
      newpassword: Joi.string().min(6).trim().required(),
    }).validateAsync(req.body, { abortEarly: false });

    const comparepass = await bcrypt.compare(
      validData.password,
      existUser.password
    );
    if (!comparepass) {
      return res.status(401).json({
        message: error[401],
      });
    }

    const userNewPassword = await bcrypt.hash(validData.newpassword, 10);
    existUser.password = userNewPassword;

    await existUser.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    if (err.isJoi) {
      return res.status(422).json({
        message: error[422],
        error: err.details.map((item) => item.message),
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const AuthContoller = () => ({
  login,
  register,
  resetPass,
});
