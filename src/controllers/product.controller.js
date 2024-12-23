import Joi from "joi";

const productSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    oldPrice: Joi.number().optional(),
    countInStock: Joi.number().required(),
    categories: Joi.array().items(Joi.string()).optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    options: Joi.array().items(Joi.object({
        key : Joi.string().required(),
        value : Joi.string().required()
    })).required(),
})

const createProduct = async(req, res) => {
    try {
        const  {value, error} = productSchema.validate(req.body , {abortEarly: false});
        res.status(201).json({
            value,
            error
        });
    } catch (error) {
        next(error);
    }
}

export const productController = () => ({
    createProduct,
})