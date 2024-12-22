import Joi from "joi";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { error } from "../consts.js";

const adminCreate = async (req, res, next) => {
  const validData = await Joi.object({
    name: Joi.string().trim().min(3).max(12).required(),
    surname: Joi.string().trim().min(3).max(12).required(),
    email: Joi.string().email().required(),
    password: Joi.string().trim().min(6).max(16).required(),
  })
    .validateAsync(req.body, { abortEarly: false })
    .catch((err) => {
      return res.status(422).json({
        message: error[422],
        error: err.details.map((item) => item.message),
      });
    });

  try {
    const existAdmin = await User.findOne({ email: validData.email });

    if (existAdmin)
      return res.status(409).json({
        message: error[409],
      });
    validData.password = await bcrypt.hash(validData.password, 10);

    const newAdmin = new User({
      ...validData,
      role: "admin",
    });
    await newAdmin.save();

    return res.status(201).json(newAdmin);
  } catch (err) {
    return res.status(500).json({
      message: error[500],
      error: err.message,
    });
  }
};

const adminEdit = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: error[400] });
  }

  try {
    const adminToEdit = await User.findById(id);

    if (!adminToEdit) {
      return res.status(404).json({ message: error[404] });
    }

    const schema = Joi.object({
      name: Joi.string().trim().min(3).max(12).required(),
      surname: Joi.string().trim().min(3).max(12).required(),
      email: Joi.string().email().required(),
    });

    const validData = await schema.validateAsync(req.body, {
      abortEarly: false,
    });

    const updatedAdmin = await User.findByIdAndUpdate(id, validData, {
      new: true,
      runValidators: true,
    });

    if (!updatedAdmin) {
      return res.status(500).json({ message: error[500] });
    }

    return res.status(200).json(updatedAdmin);
  } catch (err) {
    if (err.isJoi) {
      return res.status(422).json({
        message: error[422],
        errors: err.details.map((item) => item.message),
      });
    }
    return res.status(500).json({
      message: error[500],
      error: err.message,
    });
  }
};
const adminDelete = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: error[400] });
  }

  try {
    const adminToDelete = await User.findById(id);

    if (!adminToDelete) {
      return res.status(404).json({ message: error[404] });
    }

    await User.deleteOne({ _id: id });

    return res.json({ message: "Admin uğurla silindi." });
  } catch (err) {
    return res.status(500).json({ message: error[500], error: err.message });
  }
};

export const AdminController = () => ({
  adminCreate,
  adminEdit,
  adminDelete,
});
