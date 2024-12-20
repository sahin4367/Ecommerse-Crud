import Joi from "joi"
import { User } from "../models/user.model.js"
import { Category } from "../models/category.model.js"


const create = async (req, res, next) => {

    const {name, img} = await Joi.object({
        name: Joi.string().trim().min(3).max(50).required(),
        img: Joi.object(),
    }).validateAsync({
        ...req.body,
        img: req.file,
    }, { abortEarly: false })
        .catch(err => {
            return res.status(422).json({
                message: "Xeta bash verdi!",
                error: err.details.map(item => item.message)
            })
        })

    const newCategory = await  Category.create({
        name,
        img_path: img?.filename ,
    }).then(newCategory => res.status(201).json(newCategory))
        .catch(error => res.status(500).json({
            message: "Xeta bash verdi!",
            error,
        }))
}

const allCategories = async (req, res, next) => {

    const categories = await Category.find()
    res.json(categories)
}

const CategoryEdit = async (req, res, next) => {

    const {name, img} = await Joi.object({
        name: Joi.string().trim().min(3).max(50).required(),
        img: Joi.object(),
    }).validateAsync({
        ...req.body,
        img: req.file,
    }, { abortEarly: false })
        .catch(err => {
            return res.status(422).json({
                message: "Xeta bash verdi!",
                error: err.details.map(item => item.message)
            })
        })

    const category = await Category.findById({
      _id: req.params.id,
    });
  
if (!category) return res.json("Bele bir category yoxdur");

const bazadakiImgName = category.img_path?.split('-')[1];;

// `img` POST sorğusunda daxil edilməyibsə, mövcud şəkil saxlanır
    if (req.file === undefined && req.body.img === undefined) {
        category.img_path = category.img_path;
      }
// `img` POST sorğusunda daxil edilib, amma fayl seçilməyibsə 
    else if (!img) {
        category.img_path = null;
      }
// Fayl daxil edilibsə      
       else if (img) {
        category.img_path = img.filename;
      }
      
      await category.save()

      const sonImgName = category.img_path?.split('-')[1];;         

    const updateCategory = await Category.updateMany(
      { _id: req.params.id },
      { name,}
    );

    if (updateCategory.modifiedCount > 0 || (sonImgName !== bazadakiImgName)) {
      return res.json("Blog uğurla yeniləndi");
    } else {
      res.json("Hech bir deyishiklik yoxdur");
    }
}

const DeleteCategory = async (req, res, next) => {
    const id = req.params.id;
  
    const category = await Category.findOne({
      _id: id,
    });
  
    if (!category) return res.json("Belə bir Category yoxdur");
  
    const DeleteCategory = await Category.deleteOne({
      _id: id,
    });
  
    res.send("Category deleted successfully from database");
}
  

export const categoryContoller = () => ({
    create,
    allCategories,
    CategoryEdit,
    DeleteCategory
})