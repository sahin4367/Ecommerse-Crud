import Joi from "joi"
import { User } from "../models/user.model.js"
import { Category } from "../models/category.model.js"


const create = async (req, res, next) => {

    const {name, img, featured} = await Joi.object({
        name: Joi.string().trim().min(3).max(50).required(),
        img: Joi.object(),
        featured: Joi.boolean()
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

    if (featured) {
            const featuredCount = await Category.countDocuments({ featured: true });
            console.log(featuredCount)
            if (featuredCount >= 5) {
              return res.status(400).json({
                message: 'Maksimum 6 featured kateqoriya ola bilər'
              });}}

const exsistCategory = await Category.findOne({
    name: name,
    });
          
     if (exsistCategory) {
        return res.status(409).json({
         message: "Bu category hal-hazirda movcuddur",
    });
              }
    const newCategory = await  Category.create({
        name,
        img_path: img?.filename ,
        featured,
    }).then(newCategory => res.status(201).json(newCategory))
        .catch(error => res.status(500).json({
            message: "Xeta bash verdi!",
            error,
        }))
}

const allCategories = async (req, res, next) => {

    const categories = await Category.find()
    if (categories.length === 0) {
        return res.status(404).json({
          message: "Categoriyalar tapilmadi",
        });}
    res.json(categories)
}

const getCategory = async (req, res, next) => {
    try {
      const id = req.params.id;
  
      const category = await Category.findById(id);
  
      if (!category) {
        return res.status(400).json({
          message: "Category tapilmadi",
        });
      }
 
      res.status(200).json(category);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Server xetasi bas verdi",
        error: error.message,
      });
    }
  };  

const featuredCategories = async (req, res, next) => {
    const categories = await Category.find()
    const featuredCtrgy = await categories.filter(item => item.featured);
    res.json(featuredCtrgy);
}

const CategoryEdit = async (req, res, next) => {

    const {name, img, featured} = await Joi.object({
        name: Joi.string().trim().min(3).max(50).required(),
        img: Joi.object(),
        featured: Joi.boolean()
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
      { name,
        featured,}
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
    getCategory,
    featuredCategories,
    CategoryEdit,
    DeleteCategory
})