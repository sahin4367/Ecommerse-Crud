import { Product } from "../models/product.model.js";

// mehsul yaratmaq create etmek : "Create"
const createProduct = async (req,res) => {
    try {
        const product = new Product(req.body);
        const savedProduct = await product.save();
        res.status(200).json(savedProduct);
    } catch (error) {
        res.status(500).json({
            message: 'Mehsl yaratmaq mumkun olmadi!',
            error : error.message
        })
        
    }
}

const getAllProduct = async (req,res) => {
    try {
        const  Products = await Product.find().papulate("categgories");
        res.json(Products);
    } catch (error) {
        res.status(500).json({
            message : `Mehsullari getirmek mumkun olmadi !`,
            error : error.message
        })
    }
}

// id ye gore mehsulu getirmek : :
const getProductById = async (req,res) => {
    try {
        const product = await Product.findById(req.params.id).papulate("categories");
        if (!product) {
            return res.status(404).json({message : `Mehsul tapilmadi`})
        }
        res.json(product)
    } catch (error) {
        res.status(500).json({
            message : `Mehsullari getirmek mumkun olmadi !`,
            error : error.message
        })
    }
}


// mehsulu yenilemek : 

const updateProduct = async (req,res) => {
    try {
        const updateProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            })
        if (!updateProduct) { 
            return res.status(404).json({message : `Mehsul  tapilmadi .`})
        }
        res.json(updateProduct);
    } catch (error) {
        res.status(500).json({
            message : `Mehsulu yenilemek mumkun olmadi !`,
            error : error.message
        })
    }
    
}


// mehsulu silmek : 
const deleteProduct = async (req,res) => {
    try {
        const deleteProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deleteProduct) {
            return res.status(404).json({message : `mehsul tapilmadi .`})
        }
        res.json(deleteProduct)
    } catch (error) {
        res.status(500).json({
            message : `Mehsulu silmek  olmadi !`,
            error : error.message
        })
    }
}


export const ProductController = {
    createProduct,
    getAllProduct,
    getProductById,
    updateProduct,
    deleteProduct
}