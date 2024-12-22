import Joi from "joi";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
const error = {
	422: "Validasiya Xətası!",
	409: "Bu istifadəçi artıq mövcuddur!",
	500: "Server xətası!",
	404: "Bu istifadəçi tapılmadı",
	403: "İcazəniz yoxdur"
};

const adminCreate = async (req, res, next) => {

	const validData = await Joi.object({
		name: Joi.string().trim().min(3).max(12).required(),
		surname: Joi.string().trim().min(3).max(12).required(),
		email: Joi.string().email().required(),
		password: Joi.string().trim().min(6).max(16).required(),
		role: Joi.string().trim(),
	})
		.validateAsync(req.body, { abortEarly: false })
		.catch((err) => {
			return res.status(422).json({
				message: error[422],
				error: err.details.map((item) => item.message),
			});
		});

	validData.role = "admin";

	try {
		const existAdmin = await User.findOne({ email: validData.email });

		if (existAdmin)
			return res.status(409).json({
				message: error[409],
			});
		validData.password = await bcrypt.hash(validData.password, 10);

		const newAdmin = await User.create(validData);

		return res.json(newAdmin);
	} catch (err) {
		return res.status(500).json({
			message: error[500],
		});
	}
};

const adminEdit = async (req, res) => {
	try {
		const adminToEdit = await User.findById(req.params.id);
		
		if (!adminToEdit) {
			return res.status(404).json({ message: error[404] });
		}
		const schema = Joi.object({
			name: Joi.string().trim().min(3).max(12).required(),
			surname: Joi.string().trim().min(3).max(12).required(),
			email: Joi.string().email().required(),
		});
		
		const validData = await schema.validateAsync(req.body, { abortEarly: false });

		const updatedAdmin = await User.findByIdAndUpdate(
			req.params.id,
			validData,
			{ new: true }
		);

		res.json(updatedAdmin);
	} catch (err) {
		if (err.isJoi) {
			return res.status(422).json({
				message: error[422],
			})
		}
		res.status(500).json({ message: error[500] });
	}
};




export const AdminController = () => ({
	adminCreate,
	adminEdit,
});
