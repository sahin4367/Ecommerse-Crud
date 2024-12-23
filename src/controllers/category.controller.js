import Joi from "joi";
// import { User } from "../models/user.model.js";
import { Category } from "../models/category.model.js";

const create = async (req, res, next) => {
    try {
        const { name, img } = await Joi.object({
            name: Joi.string().trim().min(3).max(50).required(),
            img: Joi.any(),
        }).validateAsync(
            {
                ...req.body,
                img: req.file,
            },
            { abortEarly: false }
        );

        const newCategory = await Category.create({
            name,
            img_path: img?.filename,
            // img_path : imgages?.filename
        });
        res.status(201).json(newCategory);
    } catch (err) {
        res.status(422).json({
            message: "Xeta bash verdi!",
            error: err.details ? err.details.map(item => item.message) : err,
        });
    }
};

const alllist = async (req, res, next) => {
    //pagination hissesi  :::
    const page = req.query.page || 1
    const limit = req.query.limit || 3
    const totalCateqories = await Category.countDocuments()

    const categories = await Category.find().skip((page-1)*limit).limit(limit);
    res.status(200).json({
        status : true,
        data : categories,
        pagination : {
            totalCateqories : totalCateqories,
            currentpage : page,
            countpageCateqor : Math.ceil(totalCateqories/limit)
        }
    });    
};


const updateCateqory = async (req, res, next) => {
    try {
        const { name, img } = await Joi.object({
            name: Joi.string().trim().min(3).max(50).required(),
            img: Joi.any(),
        }).validateAsync(
            {
                ...req.body,
                img: req.file,
            },
            { abortEarly: false }
        );

        const category = await Category.findById(req.params.id);

        if (!category) return res.status(404).json({ message: "Cateqory tapilmadi ve ya yoxdur !" });

        if (!req.file && !req.body.img) {
            category.img_path = category.img_path;
        } else if (req.file) {
            category.img_path = req.file.filename;
        } else if (!req.file && req.body.img === null) {
            category.img_path = null;
        }

        category.name = name;
        await category.save();

        res.json("Category uğurla yeniləndi");
    } catch (err) {
        res.status(422).json({
            message: "Xeta bas verdi!",
            error: err.details ? err.details.map(item => item.message) : err,
        });
    }
};

const DeleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) return res.status(404).json({ message: "Cateqory tapilmadi ve ya yoxdur!" });

        await Category.deleteOne({ _id: req.params.id });
        res.status(200).send("Cateqoru ugurla silindi!");
    } catch (err) {
        res.status(500).json({ message: "Xeta bas verdi!", error: err });
    }
};

export const categoryContoller = () => ({
    create,
    alllist,
    updateCateqory,
    DeleteCategory,
});
